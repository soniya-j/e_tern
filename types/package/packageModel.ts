import { Document } from 'mongoose';

export interface Ipackage extends Document {
  packageName: string;
  ageFrom: number;
  ageTo: number;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface IPackageBody {
  packageName: string;
  ageFrom: number;
  ageTo: number;
  description?: string;
}
