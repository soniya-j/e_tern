import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import {
  SubCategoryRepo,
  saveSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from '../repos/subCategoryRepo';
import {
  ISubCategory,
  ISubCategoryWithTracking,
  ISubCategoryBody,
} from '../../types/subcategory/subCategoryModel';
import {
  getCourseMaterialTrackBySubCategory,
  checkSubCategoryIsChoosed,
} from '../../coursematerial/repos/courseMaterialRepo';
import { checkCategoryExists } from '../../category/repos/categoryRepo';
import { processAndUploadImage } from '../../utils/imageUploader';

export const getAllSubCategoryUseCase = async (
  filters: Partial<ISubCategory>,
  limit: number,
  page: number,
): Promise<{ data: ISubCategory[]; totalCount: number }> => {
  const subCategoryRepo = new SubCategoryRepo();
  const result = await subCategoryRepo.findAllSubCategories(filters, limit, page);
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

/*
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
*/

export const getSubCategoriesByCategoryIdUseCase = async (
  categoryId: string,
  type: string,
  userId?: string,
): Promise<ISubCategoryWithTracking[]> => {
  const subCategoryRepo = new SubCategoryRepo();
  const subCategories: ISubCategory[] = await subCategoryRepo.findSubCategoriesByCategoryId(
    categoryId,
    type,
  );
  if (!subCategories || subCategories.length === 0) {
    throw new AppError('No subcategories found for the given category', HttpStatus.NOT_FOUND);
  }
  // If user is logged in, get tracking data
  if (userId) {
    const subCategoriesWithTracking: ISubCategoryWithTracking[] = await Promise.all(
      subCategories.map(async (subCategory): Promise<ISubCategoryWithTracking> => {
        const subCategoryId = subCategory._id.toString();
        const subCategoryPlain =
          'toObject' in subCategory
            ? (subCategory as ISubCategory & { toObject: () => object }).toObject()
            : subCategory;
        const { totalMaterials, viewedMaterials, percentageViewed } =
          await getCourseMaterialTrackBySubCategory(userId, subCategoryId);
        return {
          ...subCategoryPlain,
          totalMaterials,
          viewedMaterials,
          percentageViewed: Math.round(percentageViewed),
        };
      }),
    );
    return subCategoriesWithTracking;
  }
  return subCategories as ISubCategoryWithTracking[];
};

export const createSubCategoryUseCase = async (
  data: ISubCategoryBody,
  file?: Express.Multer.File,
): Promise<Pick<ISubCategory, '_id'>> => {
  const exists = await checkCategoryExists(data.categoryId);
  if (!exists) {
    throw new AppError('No categories found for the given categoryId', HttpStatus.NOT_FOUND);
  }
  // Process the uploaded image
  if (file) {
    const uploadedFilePath = await processAndUploadImage(file, 'subcategory');
    data.imageUrl = uploadedFilePath;
  }
  const result = await saveSubCategory(data);
  return result;
};

export const updateSubCategoryUseCase = async (
  id: string,
  data: ISubCategoryBody,
  file?: Express.Multer.File,
): Promise<Pick<ISubCategory, '_id'>> => {
  const exists = await checkCategoryExists(data.categoryId);
  if (!exists) {
    throw new AppError('No categories found for the given categoryId', HttpStatus.NOT_FOUND);
  }
  // Process the uploaded image
  if (file) {
    const uploadedFilePath = await processAndUploadImage(file, 'subcategory');
    data.imageUrl = uploadedFilePath;
  }
  const result = await updateSubCategory(id, data);
  return result;
};

export const deleteSubCategoryUseCase = async (id: string): Promise<boolean> => {
  const checkSubCategoryIsChoosedRes = await checkSubCategoryIsChoosed(id);
  if (checkSubCategoryIsChoosedRes) {
    throw new AppError(
      'Deletion not allowed as this sub category is already in use.',
      HttpStatus.BAD_REQUEST,
    );
  }
  const deleteSubCategoryResult = await deleteSubCategory(id);
  if (!deleteSubCategoryResult) {
    throw new AppError('Failed to delete sub category', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return true;
};

export const getSubCategoriesByIdUseCase = async (id: string): Promise<ISubCategory[]> => {
  const subCategoryRepo = new SubCategoryRepo();
  const result = await subCategoryRepo.findSubCategoriesById(id);
  if (!result || result.length === 0) {
    throw new AppError('No sub categories found for the given id', HttpStatus.NOT_FOUND);
  }
  return result;
};
