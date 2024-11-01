import { Request, Response } from 'express';
import { getAllPackagesUseCase } from '../useCases/packageUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
//import { IPackageBody } from '../../types/package/packageModel';

export const getAllPackages = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllPackagesUseCase();

  res.status(200).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});
