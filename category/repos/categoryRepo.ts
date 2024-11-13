import categoryModel from '../models/categoryModel';
import { ICategory, ICategoryBody } from '../../types/category/categoryModel';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export class CategoryRepo {
  async findAllCategories(): Promise<ICategory[]> {
    return await categoryModel.find({ isActive: true, isDeleted: false }).sort({ sorting: 1 });
  }

  async findCategoriesByPackageId(packageId: string, type: string): Promise<ICategory[]> {
    return await categoryModel
      .find({ packageId, type, isActive: true, isDeleted: false })
      .sort({ sorting: 1 })
      .lean();
  }
}

export const saveCategory = async (data: ICategoryBody): Promise<{ _id: string }> => {
  const result = await categoryModel.create(data);
  return { _id: result._id as string };
};

export const checkCategoryExists = async (id: string) => {
  const result = await categoryModel.findById(id);
  return !!result;
};

export const updateCategory = async (id: string, data: ICategoryBody): Promise<{ _id: string }> => {
  const updatedRes = await categoryModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedRes) {
    throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return { _id: updatedRes._id as string };
};
