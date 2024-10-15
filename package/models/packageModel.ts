import { Schema, model } from 'mongoose';
import { IPackage } from '../../types/package/packageModel';

const packageSchema = new Schema<IPackage>(
  {
    packageName: { type: String, required: true },
    ageFrom: { type: Number, required: true },
    ageTo: { type: Number, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const packageModel = model<IPackage>('package', packageSchema);
export default packageModel;
