import categoryModel from '../models/categoryModel';
import { ICategory } from '../../types/category/categoryModel';

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
