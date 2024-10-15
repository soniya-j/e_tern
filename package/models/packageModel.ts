import { Schema, model } from 'mongoose';
import { Ipackage } from '../../types/package/packageModel';

const packageSchema = new Schema<Ipackage>(
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

const packageModel = model<Ipackage>('package', packageSchema);
export default packageModel;
