import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { RefreshToken } from '../entities/RefreshToken';
import { StoreOwner } from '../entities/StoreOwner';
import { Freelancer } from '../entities/Freelancer';
import { RegisterDto, LoginResponse, RegisterResponse, JwtPayload } from '../types/auth';
import { ConflictError, UnauthorizedError, NotFoundError, AppError } from '../utils/errors';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);
  private refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

  async register(data: RegisterDto): Promise<RegisterResponse> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: data.email }, { phone: data.phone }],
    });

    if (existingUser) {
      throw new ConflictError('Email or phone already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      gender: data.gender || null,
      avatar: data.avatar || null,
      role: data.role,
      isVerified: false,
    });

    await this.userRepository.save(user);

    if (data.role === 'owner') {
      await this.createOwnerProfile(user.id);
    } else if (data.role === 'freelancer') {
      await this.createFreelancerProfile(user.id, data);
    }

    return {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async login(emailOrPhone: string, password: string): Promise<LoginResponse> {
    const user = await this.userRepository.findOne({
      where: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email/phone or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email/phone or password');
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const tokenEntity = this.refreshTokenRepository.create({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    await this.refreshTokenRepository.save(tokenEntity);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const tokenEntity = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken, userId: decoded.userId, isRevoked: false },
      });

      if (!tokenEntity) {
        throw new UnauthorizedError('Invalid or revoked refresh token');
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

      const accessToken = generateAccessToken(user.id, user.role);

      return { accessToken };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  async logout(accessToken: string): Promise<{ message: string }> {
    try {
      const decoded = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      // Đánh dấu tất cả refresh tokens của user này là revoked
      await this.refreshTokenRepository.update(
        { userId: decoded.userId, isRevoked: false },
        { isRevoked: true }
      );

      return { message: 'Logged out successfully' };
    } catch {
      throw new UnauthorizedError('Invalid access token');
    }
  }

  private async createOwnerProfile(userId: string): Promise<void> {
    const storeOwnerRepository = AppDataSource.getRepository(StoreOwner);

    const storeOwner = storeOwnerRepository.create({
      userId,
    });
    await storeOwnerRepository.save(storeOwner);
  }

  private async createFreelancerProfile(userId: string, data: RegisterDto): Promise<void> {
    const freelancerRepository = AppDataSource.getRepository(Freelancer);
    const freelancer = freelancerRepository.create({
      userId,
      houseNumber: data.houseNumber || null,
      street: data.street || null,
      ward: data.ward || null,
      district: data.district || null,
      city: data.city || null,
    });
    await freelancerRepository.save(freelancer);
  }
}
