import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  RegisterResponse,
  SecureLoginResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from '../types/auth';
import { SuccessResponse } from '../types/response.types';
import { asyncHandler } from '../utils/async-handler';
import { UnauthorizedError } from '../utils/errors';

const authService = new AuthService();

export const register = asyncHandler(
  async (
    req: Request<object, object, RegisterDto>,
    res: Response<SuccessResponse<RegisterResponse>>
  ): Promise<void> => {
    console.log('Register request body:', req.body);
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  }
);

export const login = asyncHandler(
  async (
    req: Request<object, object, LoginDto>,
    res: Response<SuccessResponse<SecureLoginResponse>>
  ): Promise<void> => {
    const { emailOrPhone, password } = req.body;
    const result = await authService.login(emailOrPhone, password);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: result.accessToken,
      },
    });
  }
);

export const refreshToken = asyncHandler(
  async (
    req: Request<object, object, RefreshTokenDto>,
    res: Response<SuccessResponse<RefreshTokenResponse>>
  ): Promise<void> => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token required');
    }
    
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response<SuccessResponse<LogoutResponse>>): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token required');
    }

    const accessToken = authHeader.substring(7);
    const result = await authService.logout(accessToken);

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  }
);