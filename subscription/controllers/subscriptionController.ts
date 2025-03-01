import { Request, Response } from 'express';
import {
  subscriptionUseCase,
  offlinePaymentUseCase,
  getOfflinePaymentsUseCase,
  getSubscriptionByIdUseCase,
  getRevenueDetailsUseCase,
} from '../useCases/subscriptionUseCase';
import { responseMessages } from '../../config/localization';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import {
  ISubscriptionPaymentBody,
  IOfflinePaymentBody,
} from '../../types/subscription/subscriptionType';

export const subscription = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as ISubscriptionPaymentBody;
  const userId = res.locals.userId as string;
  const result = await subscriptionUseCase(data, userId);
  res.status(200).json({
    success: true,
    message: responseMessages.subscription_success,
    result: result,
  });
});

export const addOfflinePayment = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as IOfflinePaymentBody;
  const userId = res.locals.userId as string;
  const file = req.file;
  const result = await offlinePaymentUseCase(data, userId, file || undefined);
  res.status(200).json({
    success: true,
    message: responseMessages.subscription_success,
    result: result,
  });
});

export const getOfflinePayments = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    studentName: req.query.studentName as string,
  };
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const page = limit ? parseInt(req.query.page as string) || 1 : 0;
  const mode = typeof req.query.mode === 'string' ? req.query.mode : undefined;

  const result = await getOfflinePaymentsUseCase(filters, limit, page, mode);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getSubscriptionById = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const result = await getSubscriptionByIdUseCase(id);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getRevenueDetails = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const result = await getRevenueDetailsUseCase();
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});
