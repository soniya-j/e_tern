import { Request, Response } from 'express';
import {
  getStudentsByUserIdUseCase,
  addStudentUseCase,
  updateStudentUseCase,
} from '../useCases/studentUseCase';
import { responseMessages } from '../../config/localization';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { IStudentBody } from '../../types/student/studentType';

export const getStudentsByUserId = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  try {
    const userId = res.locals.userId as string;
    const result = await getStudentsByUserIdUseCase(userId);
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

export const addStudent = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as IStudentBody;

  const result = await addStudentUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_post,
    result: result,
  });
});

export const updateStudent = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const { studentId } = req.params as { studentId: string };
  const data = req.body as IStudentBody;
  const result = await updateStudentUseCase(studentId, data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_put,
    result: result,
  });
});
