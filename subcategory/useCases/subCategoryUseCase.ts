import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
//import { ICategoryBody } from '../../types/category/categoryModel';
import { SubCategoryRepo } from '../repos/subCategoryRepo';
import { ISubCategory } from '../../types/subcategory/subCategoryModel';

export const getAllSubCategoryUseCase = async (): Promise<ISubCategory[]> => {
  const subCategoryRepo = new SubCategoryRepo();
  const result = await subCategoryRepo.findAllSubCategories();
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

export const getSubCategoriesByCategoryIdUseCase = async (
  categoryId: string,
): Promise<ISubCategory[]> => {
  const subCategoryRepo = new SubCategoryRepo();
  const result = await subCategoryRepo.findSubCategoriesByCategoryId(categoryId);

  if (!result || result.length === 0) {
    throw new AppError('No sub categories found for the given category', HttpStatus.NOT_FOUND);
  }

  return result;
};
