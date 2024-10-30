import { Schema, model } from 'mongoose';
import { ICategory } from '../../types/category/categoryModel';

const categorySchema = new Schema<ICategory>(
  {
    categoryName: { type: String, required: true },
    packageId: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    sorting: { type: Number, default: 1 },
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const categoryModel = model<ICategory>('Category', categorySchema);
export default categoryModel;
