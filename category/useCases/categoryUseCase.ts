import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
//import { ICategoryBody } from '../../types/category/categoryModel';
import { CategoryRepo } from '../repos/categoryRepo';
import { ICategory, ICategoryWithTracking } from '../../types/category/categoryModel';
import { getCourseMaterialTrackByCategory } from '../../coursematerial/repos/courseMaterialRepo';
import { objectIdToString } from '../../utils/objectIdParser';
import { ObjectId } from 'mongodb';
import { findPackage, findStudentExists } from '../../student/repos/studentRepo';

export const getAllCategoryUseCase = async (): Promise<ICategory[]> => {
  const categoryRepo = new CategoryRepo();
  const result = await categoryRepo.findAllCategories();
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

/*
export const getCategoriesByPackageIdUseCase = async (
  packageId: string,
  type: string,
): Promise<ICategory[]> => {
  const categoryRepo = new CategoryRepo();
  const result = await categoryRepo.findCategoriesByPackageId(packageId, type);
  if (!result || result.length === 0) {
    throw new AppError('No categories found for the given package', HttpStatus.NOT_FOUND);
  }
  return result;
};
*/

export const getCategoriesByPackageIdUseCase = async (
  studentId: string,
  type: string,
  userId: string,
): Promise<ICategoryWithTracking[]> => {
  const categoryRepo = new CategoryRepo();

  const studentExists = await findStudentExists(studentId, userId);
  if (!studentExists) {
    throw new AppError('No profile found for the given studentId', HttpStatus.NOT_FOUND);
  }

  const packageResult = await findPackage(studentId);
  const packageId = packageResult?.packageId;
  if (!packageId) {
    throw new AppError('No categories found for the given studentId', HttpStatus.NOT_FOUND);
  }

  const categories: ICategory[] = await categoryRepo.findCategoriesByPackageId(packageId, type);

  if (!categories || categories.length === 0) {
    throw new AppError('No categories found for the given studentId', HttpStatus.NOT_FOUND);
  }

  if (userId) {
    const categoriesWithTracking: ICategoryWithTracking[] = await Promise.all(
      categories.map(async (category): Promise<ICategoryWithTracking> => {
        const categoryId = objectIdToString(category._id as ObjectId);

        const categoryPlain =
          'toObject' in category
            ? (category as ICategory & { toObject: () => object }).toObject()
            : category;
        const { totalMaterials, viewedMaterials, percentageViewed } =
          await getCourseMaterialTrackByCategory(userId, categoryId);
        return {
          ...categoryPlain,
          totalMaterials,
          viewedMaterials,
          percentageViewed: Math.round(percentageViewed),
        };
      }),
    );
    return categoriesWithTracking;
  }
  return categories as ICategoryWithTracking[];
};
