import { Request, Response } from 'express';
import {
  getAllPackagesUseCase,
  createPackageUseCase,
  updatePackageUseCase,
} from '../useCases/packageUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import { IPackageBody } from '../../types/package/packageModel';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';

export const getAllPackages = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllPackagesUseCase();

  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const createPackage = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const data = req.body as IPackageBody;
  const result = await createPackageUseCase(data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_post,
    result: result,
  });
});

export const updatePackage = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const data = req.body as IPackageBody;
  const result = await updatePackageUseCase(id, data);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_put,
    result: result,
  });
});
