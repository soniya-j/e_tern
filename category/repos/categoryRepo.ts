import categoryModel from '../models/categoryModel';

export class CategoryRepo {
  async findAllCategories() {
    return await categoryModel.find({ isActive: true });
  }
}
