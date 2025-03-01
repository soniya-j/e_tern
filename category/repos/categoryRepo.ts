import categoryModel from '../models/categoryModel';
import { ICategory, ICategoryBody } from '../../types/category/categoryModel';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { ObjectID } from '../../utils/objectIdParser';

export class CategoryRepo {
  async findAllCategories(
    filters: Partial<ICategory>,
    limit?: number,
    page?: number,
  ): Promise<{ data: ICategory[]; totalCount: number }> {
    const query: any = {};
    if (filters.categoryName) {
      query.categoryName = { $regex: filters.categoryName, $options: 'i' };
    }
    if (filters.type) {
      query.type = { $regex: filters.type, $options: 'i' };
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    query.isDeleted = false;
    if (limit !== undefined && page !== undefined) {
      const skip = (page - 1) * limit;
      const data = await categoryModel
        .find(query)
        .populate('packageId', 'packageName packageId')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .lean();
      const totalCount = await categoryModel.countDocuments(query);
      return {
        data,
        totalCount,
      };
    }
    query.isActive = true;
    return await categoryModel
      .find(query)
      .populate('packageId', 'packageName packageId')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findCategoriesByPackageId(packageId: string, type: string): Promise<ICategory[]> {
    return await categoryModel
      .find({ packageId, type, isActive: true, isDeleted: false })
      .sort({ sorting: 1 })
      .lean();
  }

  async findCategoriesById(id: string): Promise<ICategory[] | null> {
    return await categoryModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: 'packageId',
        select: 'packageName',
      })
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

export const deleteCategory = async (id: string): Promise<{ _id: string }> => {
  const result: any = await categoryModel.findOneAndUpdate(
    { _id: ObjectID(id) },
    { isDeleted: true, modifiedOn: new Date().toISOString() },
    { new: true },
  );
  if (!result) {
    throw new AppError('No document found with the Id', HttpStatus.NOT_FOUND);
  }
  return result;
};
