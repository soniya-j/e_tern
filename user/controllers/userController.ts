import { Request, Response } from 'express';
import {
  registerUserUseCase,
  uploadAvatarUseCase,
  verifyOtpUseCase,
  sendOtpUseCase,
  getProfileUseCase,
} from '../useCases/userUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import { IOtpBody, IUserBody } from '../../types/user/userTypes';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import AppError from '../../common/appError';

export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  const data = req.body as IUserBody;
  await registerUserUseCase(data);
  res.status(201).json({
    success: true,
    message: responseMessages.registration_success,
    result: '',
  });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  const data = req.body as IOtpBody;
  const result = await verifyOtpUseCase(data);
  res.status(201).json({
    success: true,
    message: responseMessages.otp_verify_success,
    result,
  });
});

export const uploadAvatar = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
  }
  if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
    return res.status(400).json({ status: 'fail', error: 'Unsupported file type' });
  }
  if (req.file.size > 2 * 1024 * 1024) {
    return res.status(400).json({ status: 'fail', error: 'file size exceeded' });
  }
  const userId = res.locals.userId as string; // get userId from locals ( using JWT middleware )
  if (!userId || userId === '') {
    return res.status(401).send('Unauthorized');
  }
  const imageUrl = await uploadAvatarUseCase(req.file, userId);
  res.status(201).json({
    status: 'success',
    message: 'image uploaded successfully',
    result: imageUrl,
  });
};

export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  const data = req.body as IOtpBody;
  const result = await sendOtpUseCase(data);
  res.status(201).json({
    success: true,
    message: responseMessages.otp_send_success,
    result,
  });
});

export const getProfile = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }

  try {
    const { userId } = req.params;
    const result = await getProfileUseCase(userId);
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
