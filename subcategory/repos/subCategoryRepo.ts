import subCategoryModel from '../models/subCategoryModel';
import { ISubCategory, ISubCategoryBody } from '../../types/subcategory/subCategoryModel';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export class SubCategoryRepo {
  async findAllSubCategories(): Promise<ISubCategory[]> {
    return await subCategoryModel.find({ isActive: true, isDeleted: false }).sort({ sorting: 1 });
  }

  async findSubCategoriesByCategoryId(categoryId: string, type: string): Promise<ISubCategory[]> {
    return await subCategoryModel
      .find({ categoryId, type, isActive: true, isDeleted: false })
      .sort({ sorting: 1 })
      .lean();
  }
}

export const saveSubCategory = async (data: ISubCategoryBody): Promise<{ _id: string }> => {
  const result = await subCategoryModel.create(data);
  return { _id: result._id as string };
};

export const checkSubCategoryExists = async (id: string) => {
  const result = await subCategoryModel.findById(id);
  return !!result;
};

export const updateSubCategory = async (
  id: string,
  data: ISubCategoryBody,
): Promise<{ _id: string }> => {
  const updatedRes = await subCategoryModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedRes) {
    throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return { _id: updatedRes._id as string };
};
