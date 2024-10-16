import subCategoryModel from '../models/subCategoryModel';
import { ISubCategory } from '../../types/subcategory/subCategoryModel';

export class SubCategoryRepo {
  async findAllSubCategories(): Promise<ISubCategory[]> {
    return await subCategoryModel.find({ isActive: true, isDeleted: false }).sort({ sorting: 1 });
  }

  async findSubCategoriesByCategoryId(categoryId: string): Promise<ISubCategory[]> {
    return await subCategoryModel
      .find({ categoryId, isActive: true, isDeleted: false })
      .sort({ sorting: 1 });
  }
}
