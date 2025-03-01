import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { ICategoryBody } from '../../types/category/categoryModel';
import { CategoryRepo, saveCategory, updateCategory, deleteCategory } from '../repos/categoryRepo';
import { ICategory, ICategoryWithTracking } from '../../types/category/categoryModel';
import { getCourseMaterialTrackByCategory } from '../../coursematerial/repos/courseMaterialRepo';
import { objectIdToString } from '../../utils/objectIdParser';
import { ObjectId } from 'mongodb';
import { findPackage, findStudentExists } from '../../student/repos/studentRepo';
import { checkPackageExists } from '../../package/repos/packageRepo';
import { checkCategoryIsChoosed } from '../../subcategory/repos/subCategoryRepo';
import { processAndUploadImage } from '../../utils/imageUploader';

export const getAllCategoryUseCase = async (
  filters: Partial<ICategory>,
  limit?: number,
  page?: number,
): Promise<{ data: ICategory[]; totalCount: number }> => {
  const categoryRepo = new CategoryRepo();
  const result = await categoryRepo.findAllCategories(filters, limit, page);
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

export const getCategoriesByIdUseCase = async (id: string): Promise<ICategory[]> => {
  const categoryRepo = new CategoryRepo();
  const result = await categoryRepo.findCategoriesById(id);
  if (!result || result.length === 0) {
    throw new AppError('No categories found for the given id', HttpStatus.NOT_FOUND);
  }
  return result;
};

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
          await getCourseMaterialTrackByCategory(studentId, categoryId);
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

/*
export const createCategoryUseCase = async (
  data: ICategoryBody,
): Promise<Pick<ICategory, '_id'>> => {
  const exists = await checkPackageExists(data.packageId);
  if (!exists) {
    throw new AppError('No packages found for the given packageId', HttpStatus.NOT_FOUND);
  }
  const result = await saveCategory(data);
  return result;
};
*/

export const createCategoryUseCase = async (
  data: ICategoryBody,
  file?: Express.Multer.File,
): Promise<Pick<ICategory, '_id'>> => {
  const exists = await checkPackageExists(data.packageId);
  if (!exists) {
    throw new AppError('No packages found for the given packageId', HttpStatus.NOT_FOUND);
  }
  // Process the uploaded image
  if (file) {
    const uploadedFilePath = await processAndUploadImage(file, 'category');
    data.imageUrl = uploadedFilePath;
  }
  const result = await saveCategory(data);
  return result;
};

export const updateCategoryUseCase = async (
  id: string,
  data: ICategoryBody,
  file?: Express.Multer.File,
): Promise<Pick<ICategory, '_id'>> => {
  const exists = await checkPackageExists(data.packageId);
  if (!exists) {
    throw new AppError('No packages found for the given packageId', HttpStatus.NOT_FOUND);
  }
  // Process the uploaded image
  if (file) {
    const uploadedFilePath = await processAndUploadImage(file, 'category');
    data.imageUrl = uploadedFilePath;
  }
  const result = await updateCategory(id, data);
  return result;
};

export const deleteCategoryUseCase = async (id: string): Promise<boolean> => {
  const checkCategoryIsChoosedRes = await checkCategoryIsChoosed(id);
  if (checkCategoryIsChoosedRes) {
    throw new AppError(
      'Deletion not allowed as this category is already in use.',
      HttpStatus.BAD_REQUEST,
    );
  }
  const deleteCategoryResult = await deleteCategory(id);
  if (!deleteCategoryResult) {
    throw new AppError('Failed to delete category', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return true;
};
