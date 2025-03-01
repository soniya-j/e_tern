import { Request, Response } from 'express';
import {
  getAllCourseMaterialUseCase,
  getCourseMaterialBySubCategoryIdUseCase,
  trackCourseMaterialUserUseCase,
  createCourseMaterialUseCase,
  updateCourseMaterialUseCase,
  courseMaterialWatchHistoryUseCase,
  deleteCourseMaterialUseCase,
  getCourseMaterialsByIdUseCase,
  getVideoDetailsUseCase,
  getTrendingVideoDetailsUseCase,
} from '../useCases/courseMaterialUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import {
  ITrackCourseMaterialView,
  ICourseMaterialBody,
  ICourseMaterialWatchHistoryBody,
} from '../../types/coursematerial/courseMaterialModel';

export const getCourseMaterials = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    courseMaterialName: req.query.courseMaterialName as string,
    type: req.query.type as string,
    isActive:
      req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
  };
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const page = limit ? parseInt(req.query.page as string) || 1 : 0;

  const result = await getAllCourseMaterialUseCase(filters, limit, page);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getCourseMaterialsBySubCategoryId = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const { subCategoryId } = req.params;
    const { type } = req.params;
    const { studentId } = req.params;
    const userId = res.locals.userId as string;
    const result = await getCourseMaterialBySubCategoryIdUseCase(
      subCategoryId,
      userId,
      type,
      studentId,
    );
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

export const trackCourseMaterialView = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as ITrackCourseMaterialView;
  const userId = res.locals.userId as string;
  await trackCourseMaterialUserUseCase(data, userId);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_post,
    result: '',
  });
});

export const createCourseMaterial = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as ICourseMaterialBody;
  const result = await createCourseMaterialUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_post,
    result: result,
  });
});

export const updateCourseMaterial = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const data = req.body as ICourseMaterialBody;
  const result = await updateCourseMaterialUseCase(id, data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_put,
    result: result,
  });
});

export const createCourseMaterialWatchHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
      return;
    }
    const data = req.body as ICourseMaterialWatchHistoryBody;
    const userId = res.locals.userId as string;
    await courseMaterialWatchHistoryUseCase(data, userId);
    res.status(200).json({
      success: true,
      message: responseMessages.response_success_post,
      result: '',
    });
  },
);

export const deleteCourseMaterial = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const result = await deleteCourseMaterialUseCase(id);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_delete,
    result: result,
  });
});

export const getCourseMaterialsById = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const result = await getCourseMaterialsByIdUseCase(id);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getVideoDetails = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const result = await getVideoDetailsUseCase();
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getTrendingVideoDetails = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const result = await getTrendingVideoDetailsUseCase();
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});
