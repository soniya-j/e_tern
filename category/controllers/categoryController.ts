import { Request, Response } from 'express';
import { getAllCategoryUseCase } from '../useCases/categoryUseCase';
import asyncHandler from 'express-async-handler';
import { responseMessages } from '../../config/localization';
//import { ICategoryBody } from '../../types/category/categoryModel';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  //const data = req.body as ICategoryBody;
  // const result = await getAllCategoryUseCase(data);
  const result = await getAllCategoryUseCase();

  res.status(201).json({
    success: true,
    message: responseMessages.response_success_get,
    result: result,
  });
});
