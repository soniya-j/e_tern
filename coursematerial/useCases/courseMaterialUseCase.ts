import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
//import { ICategoryBody } from '../../types/category/categoryModel';
import { CourseMaterialRepo } from '../repos/courseMaterialRepo';
import { ICourseMaterial } from '../../types/coursematerial/courseMaterialModel';

export const getAllCourseMaterialUseCase = async (): Promise<ICourseMaterial[]> => {
  const courseMaterialRepo = new CourseMaterialRepo();
  const result = await courseMaterialRepo.findAllSubCategories();
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

export const getCourseMaterialBySubCategoryIdUseCase = async (
  categoryId: string,
): Promise<ICourseMaterial[]> => {
  const courseMaterialRepo = new CourseMaterialRepo();
  const result = await courseMaterialRepo.findSubCategoriesByCategoryId(categoryId);

  if (!result || result.length === 0) {
    throw new AppError('No data found', HttpStatus.NOT_FOUND);
  }

  return result;
};
