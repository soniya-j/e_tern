import { Schema, model } from 'mongoose';
import { ISubCategory } from '../../types/subcategory/subCategoryModel';

const subCategorySchema = new Schema<ISubCategory>(
  {
    subCategoryName: { type: String, required: true },
    categoryId: { type: String, required: true, ref: 'Category' },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    sorting: { type: Number, default: 1 },
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const subCategoryModel = model<ISubCategory>('subcategory', subCategorySchema);
export default subCategoryModel;
