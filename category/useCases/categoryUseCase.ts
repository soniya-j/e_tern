import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
//import { ICategoryBody } from '../../types/category/categoryModel';
import { CategoryRepo } from '../repos/categoryRepo';
import { ICategory } from '../../types/category/categoryModel';

export const getAllCategoryUseCase = async (): Promise<ICategory[]> => {
  const categoryRepo = new CategoryRepo();
  const result = await categoryRepo.findAllCategories();
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

export const getCategoriesByPackageIdUseCase = async (packageId: string): Promise<ICategory[]> => {
  const categoryRepo = new CategoryRepo();
  const result = await categoryRepo.findCategoriesByPackageId(packageId);

  if (!result || result.length === 0) {
    throw new AppError('No categories found for the given package', HttpStatus.NOT_FOUND);
  }

  return result;
};
