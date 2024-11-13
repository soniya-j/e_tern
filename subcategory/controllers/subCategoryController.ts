import { Request, Response } from 'express';
import {
  getAllSubCategoryUseCase,
  getSubCategoriesByCategoryIdUseCase,
  createSubCategoryUseCase,
  updateSubCategoryUseCase,
} from '../useCases/subCategoryUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import { ISubCategoryBody } from '../../types/subcategory/subCategoryModel';

export const getSubCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllSubCategoryUseCase();
  res.status(200).json({
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
    const { type } = req.params;
    const userId = res.locals.userId as string; // get userId from locals ( using JWT middleware )
    const result = await getSubCategoriesByCategoryIdUseCase(categoryId, type, userId);
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

export const createSubCategory = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as ISubCategoryBody;
  const result = await createSubCategoryUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_post,
    result: result,
  });
});

export const updateSubCategory = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const data = req.body as ISubCategoryBody;
  const result = await updateSubCategoryUseCase(id, data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_put,
    result: result,
  });
});
