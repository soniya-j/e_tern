import { Schema, model } from 'mongoose';
import { ICourseMaterial } from '../../types/coursematerial/courseMaterialModel';

const courseMaterialSchema = new Schema<ICourseMaterial>(
  {
    courseMaterialName: { type: String, required: true },
    subCategoryId: { type: String, required: true },
    courseMaterialUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    sorting: { type: Number, default: 1 },
    type: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const courseMaterialModel = model<ICourseMaterial>('coursematerial', courseMaterialSchema);
export default courseMaterialModel;
