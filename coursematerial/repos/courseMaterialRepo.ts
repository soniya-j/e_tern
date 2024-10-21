import courseMaterialModel from '../models/courseMaterialModel';
import { ICourseMaterial } from '../../types/coursematerial/courseMaterialModel';

export class CourseMaterialRepo {
  async findAllSubCategories(): Promise<ICourseMaterial[]> {
    return await courseMaterialModel
      .find({ isActive: true, isDeleted: false })
      .sort({ sorting: 1 });
  }

  async findSubCategoriesByCategoryId(subCategoryId: string): Promise<ICourseMaterial[]> {
    return await courseMaterialModel
      .find({ subCategoryId, isActive: true, isDeleted: false })
      .sort({ sorting: 1 });
  }
}
