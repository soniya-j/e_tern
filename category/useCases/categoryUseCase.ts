import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
//import { ICategoryBody } from '../../types/category/categoryModel';
import { CategoryRepo } from '../repos/categoryRepo';

//export const getAllCategoryUseCase = async (data: ICategoryBody): Promise<any> => {
export const getAllCategoryUseCase = async (): Promise<any> => {
  const categoryRepo = new CategoryRepo();
  const result = await categoryRepo.findAllCategories();
  if (!result) throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  return result;
};
