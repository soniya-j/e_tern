import { Schema, model } from 'mongoose';
import { ISubCategory } from '../../types/subcategory/subCategoryModel';

const categorySchema = new Schema<ISubCategory>(
  {
    subCategoryName: { type: String, required: true },
    categoryId: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    sorting: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const subCategoryModel = model<ISubCategory>('subcategory', categorySchema);
export default subCategoryModel;
