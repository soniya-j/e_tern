import { Document } from 'mongoose';

export interface ISubCategory extends Document {
  subCategoryName: string;
  categoryId: string;
  imageUrl: string;
  sorting: number;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface ICategoryBody {
  subCategoryName: string;
  categoryId: string;
  imageUrl: string;
  description?: string;
  sorting: number;
}
