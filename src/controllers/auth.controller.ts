import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../types/auth.types';
import { ApiResponse } from '../types/response.types';
import { asyncHandler } from '../utils/async-handler';

const authService = new AuthService();

export const register = asyncHandler(
  async (req: Request<object, object, RegisterDto>, res: Response<ApiResponse>): Promise<void> => {
    const user = await authService.register(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  }
);

export const login = asyncHandler(
  async (req: Request<object, object, LoginDto>, res: Response<ApiResponse>): Promise<void> => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  }
);

export const refreshToken = asyncHandler(
  async (
    req: Request<object, object, RefreshTokenDto>,
    res: Response<ApiResponse>
  ): Promise<void> => {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: result,
    });
  }
);

export const logout = asyncHandler(
  async (
    req: Request<object, object, RefreshTokenDto>,
    res: Response<ApiResponse>
  ): Promise<void> => {
    const { refreshToken } = req.body;
    const result = await authService.logout(refreshToken);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  }
);
