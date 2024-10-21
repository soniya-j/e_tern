import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import { getAllActivitiesUseCase } from '../useCases/activityUseCase';

export const getAllActivities = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const activities = await getAllActivitiesUseCase();
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: activities,
  });
});
