import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';
import { RegisterDto, AuthResponse, JwtPayload, RefreshTokenPayload } from '../types/auth.types';
import { ConflictError, UnauthorizedError, NotFoundError, AppError } from '../utils/errors';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

  async register(data: RegisterDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });

    if (existingUser) {
      throw new ConflictError('Email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: data.role || 'user',
    });

    await this.userRepository.save(user);

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const accessToken = this.generateAccessToken(user.id, user.role);
    const refreshToken = this.generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenEntity = this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    await this.refreshTokenRepository.save(tokenEntity);

    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as RefreshTokenPayload;

      const tokenEntity = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken, userId: decoded.userId },
      });

      if (!tokenEntity) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      if (new Date() > tokenEntity.expiresAt) {
        await this.refreshTokenRepository.delete(tokenEntity.id);
        throw new UnauthorizedError('Refresh token expired');
      }

      const user = await this.userRepository.findOne({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const accessToken = this.generateAccessToken(user.id, user.role);

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<{ message: string }> {
    await this.refreshTokenRepository.delete({ token: refreshToken });
    return { message: 'Logged out successfully' };
  }

  private generateAccessToken(userId: number, role: string): string {
    const payload: JwtPayload = { userId, role };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as any,
    });
  }

  private generateRefreshToken(userId: number): string {
    const payload: RefreshTokenPayload = { userId };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });
  }
}
