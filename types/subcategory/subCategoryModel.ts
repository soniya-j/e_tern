import { Document } from 'mongoose';

export interface ISubCategory extends Document {
  _id: string;
  subCategoryName: string;
  categoryId: string;
  imageUrl: string;
  sorting: number;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  type: string;
}

export interface ISubCategoryBody {
  subCategoryName: string;
  categoryId: string;
  imageUrl: string;
  description?: string;
  sorting: number;
  type: string;
}

export interface ISubCategoryWithTracking extends ISubCategory {
  totalMaterials: number;
  viewedMaterials: number;
  percentageViewed: number;
}
