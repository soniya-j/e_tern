import { Document } from 'mongoose';

export interface ICategory extends Document {
  categoryName: string;
  packageId: string;
  imageUrl: string;
  sorting: number;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  type: string;
}

export interface ICategoryBody {
  categoryName: string;
  packageId: string;
  imageUrl: string;
  description?: string;
  sorting: number;
  type: string;
}

export interface ICategoryWithTracking extends ICategory {
  totalMaterials: number;
  viewedMaterials: number;
  percentageViewed: number;
}
