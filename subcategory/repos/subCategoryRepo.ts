import subCategoryModel from '../models/subCategoryModel';
import { ISubCategory, ISubCategoryBody } from '../../types/subcategory/subCategoryModel';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { ObjectID } from '../../utils/objectIdParser';

export class SubCategoryRepo {
  async findAllSubCategories(
    filters: Partial<ISubCategory>,
    limit: number,
    page: number,
  ): Promise<{ data: ISubCategory[]; totalCount: number }> {
    const query: any = {};
    if (filters.subCategoryName) {
      query.subCategoryName = { $regex: filters.subCategoryName, $options: 'i' };
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    query.isDeleted = false;
    const skip = (page - 1) * limit;

    const data = await subCategoryModel
      .find(query)
      .populate({
        path: 'categoryId',
        match: { isDeleted: false },
        select: 'categoryName categoryId',
        populate: {
          path: 'packageId',
          match: { isDeleted: false },
          select: 'packageName',
        },
      })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();

    const totalCount = await subCategoryModel.countDocuments(query);
    return {
      data,
      totalCount,
    };
  }

  async findSubCategoriesByCategoryId(categoryId: string, type: string): Promise<ISubCategory[]> {
    return await subCategoryModel
      .find({ categoryId, type, isActive: true, isDeleted: false })
      .sort({ sorting: 1 })
      .lean();
  }

  async findSubCategoriesById(id: string): Promise<ISubCategory[] | null> {
    return await subCategoryModel
      .findOne({ _id: id, isDeleted: false })
      .populate({
        path: 'categoryId',
        select: 'categoryName',
      })
      .lean();
  }

  async findSubCategories(): Promise<ISubCategory[]> {
    return await subCategoryModel
      .find({ isActive: true, isDeleted: false })
      .populate({
        path: 'categoryId',
        match: { isDeleted: false },
        select: 'categoryName categoryId',
      })
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

export const checkCategoryIsChoosed = async (
  categoryId: string,
): Promise<{ _id: string } | null> => {
  return await subCategoryModel.findOne({ categoryId, isDeleted: false }).select({ _id: 1 }).lean();
};

export const deleteSubCategory = async (id: string): Promise<{ _id: string }> => {
  const result: any = await subCategoryModel.findOneAndUpdate(
    { _id: ObjectID(id) },
    { isDeleted: true, modifiedOn: new Date().toISOString() },
    { new: true },
  );
  if (!result) {
    throw new AppError('No document found with the Id', HttpStatus.NOT_FOUND);
  }
  return result;
};
