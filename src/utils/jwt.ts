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
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    }
    throw new UnauthorizedError('Invalid token');
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
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
    }
    throw new UnauthorizedError('Invalid refresh token');
  }
};
