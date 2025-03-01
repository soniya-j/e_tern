import { Request, Response } from 'express';
import {
  getAllPackagesUseCase,
  createPackageUseCase,
  updatePackageUseCase,
  deletePackageUseCase,
  getAllPackagesAdminUseCase,
  getPackagesByIdUseCase,
} from '../useCases/packageUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
import { IPackageBody } from '../../types/package/packageModel';
import { HttpStatus } from '../../common/httpStatus';
import { validationResult } from 'express-validator';
import { IPackageCostBody } from '../../types/packagecost/packageCostModel';

export const getAllPackages = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllPackagesUseCase();

  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});

export const getAllPackagesAdmin = asyncHandler(async (req: Request, res: Response) => {
  const filters = {
    packageName: req.query.packageName as string,
    type: req.query.type as string,
    isActive:
      req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
  };
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
  const page = limit ? parseInt(req.query.page as string) || 1 : 0;

  const result = await getAllPackagesAdminUseCase(filters, limit, page);

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
  //  const data = req.body as IPackageBody;
  const data = req.body as IPackageBody & { packageCosts: IPackageCostBody[] };

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

export const deletePackage = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const result = await deletePackageUseCase(id);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_delete,
    result: result,
  });
});

export const getPackagesById = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  const id = req.params.id;
  const result = await getPackagesByIdUseCase(id);
  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});
