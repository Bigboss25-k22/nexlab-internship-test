import { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { SuccessResponse } from '../types/response.types';
import { UserService, UserProfileResponse } from '../services/user.service';

const userService = new UserService();

export const getProfile = asyncHandler(
  async (req: Request, res: Response<SuccessResponse<UserProfileResponse>>): Promise<void> => {
    const userId = req.user!.userId;
    const profile = await userService.getUserProfile(userId);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profile,
    });
  }
);
