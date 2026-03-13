import jwt from 'jsonwebtoken';
import { JwtPayload, RefreshTokenPayload } from '../types/auth';
import { UnauthorizedError } from './errors';

export const generateAccessToken = (userId: string, role: string): string => {
  const payload: JwtPayload = { userId, role };
  return jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    } as Parameters<typeof jwt.sign>[2]
  );
};

export const generateRefreshToken = (userId: string): string => {
  const payload: RefreshTokenPayload = { userId };
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    } as Parameters<typeof jwt.sign>[2]
  );
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    // Kiểm tra format JWT cơ bản
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      throw new UnauthorizedError('Invalid token format');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
      throw new UnauthorizedError('Malformed token');
    } else if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Token verification failed');
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    // Kiểm tra format JWT cơ bản
    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      throw new UnauthorizedError('Invalid refresh token format');
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as RefreshTokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expired');
    } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
      throw new UnauthorizedError('Malformed refresh token');
    } else if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Refresh token verification failed');
  }
};
