import { Request, Response } from 'express';
import {
  getAllPackageCostsUseCase,
  getPackageCostsByPackageIdUseCase,
} from '../useCases/packageCostUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';

export const getPackageCosts = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllPackageCostsUseCase();
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getPackageCostsByPackageId = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  try {
    const { packageId } = req.params;
    const result = await getPackageCostsByPackageIdUseCase(packageId);
    return res.status(200).json({
      success: true,
      message: responseMessages.response_success_get,
      result: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: responseMessages.unexpected_error,
    });
  }
};
