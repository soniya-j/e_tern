import { Schema, model } from 'mongoose';
import { IPackageCost } from '../../types/packagecost/packageCostModel';

const packageCostSchema = new Schema<IPackageCost>(
  {
    packageId: { type: String, required: true },
    price: { type: Number, required: true },
    from: { type: Date, default: '' },
    to: { type: Date, default: '' },
    validity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const packageCostModel = model<IPackageCost>('packagecost', packageCostSchema);
export default packageCostModel;
