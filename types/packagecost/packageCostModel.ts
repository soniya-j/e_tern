import { Document } from 'mongoose';

export interface IPackageCost extends Document {
  packageId: string;
  price: number;
  validity: number;
  from?: Date;
  to?: Date;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface IPackageCostBody {
  packageId: string;
  price: number;
  validity: number;
  from?: Date;
  to?: Date;
}
