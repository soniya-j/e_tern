import { Request, Response } from 'express';
import {
  getAllCategoryUseCase,
  getCategoriesByPackageIdUseCase,
  createCategoryUseCase,
  updateCategoryUseCase,
  deleteCategoryUseCase,
  getCategoriesByIdUseCase,
} from '../useCases/categoryUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import { ICategoryBody } from '../../types/category/categoryModel';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    categoryName: req.query.categoryName as string,
    type: req.query.type as string,
    isActive:
      req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
  };
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const page = limit ? parseInt(req.query.page as string) || 1 : 0;

  const result = await getAllCategoryUseCase(filters, limit, page);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getCategoriesByPackageId = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  try {
    const { studentId } = req.params;
    const { type } = req.params;
    const userId = res.locals.userId as string; // get userId from locals ( using JWT middleware )
    const result = await getCategoriesByPackageIdUseCase(studentId, type, userId);
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

/*
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as ICategoryBody;
  const result = await createCategoryUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_post,
    result: result,
  });
});
*/

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const file = req.file;
  const data = req.body as ICategoryBody;
  const result = await createCategoryUseCase(data, file || undefined);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_post,
    result: result,
  });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const file = req.file;
  const data = req.body as ICategoryBody;
  const result = await updateCategoryUseCase(id, data, file || undefined);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_put,
    result: result,
  });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const result = await deleteCategoryUseCase(id);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_delete,
    result: result,
  });
});

export const getCategoriesById = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const result = await getCategoriesByIdUseCase(id);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});
