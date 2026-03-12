import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { ApiResponse } from '../types/response.types';

export const getProfile = asyncHandler(
  async (req: Request, res: Response<ApiResponse>): Promise<void> => {
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: req.user,
    });
  }
);
