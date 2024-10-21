import { Request, Response } from 'express';
import {
  getAllSubCategoryUseCase,
  getSubCategoriesByCategoryIdUseCase,
} from '../useCases/subCategoryUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';

export const getSubCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllSubCategoryUseCase();
  res.status(201).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getSubCategoriesByCategoryId = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  try {
    const { categoryId } = req.params;
    const result = await getSubCategoriesByCategoryIdUseCase(categoryId);
    return res.status(200).json({
      success: true,
      message: responseMessages.response_success_get,
      result: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      // Custom application error
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    // Unexpected errors (could log the error for debugging)
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An unexpected error occurred',
    });
  }
};
