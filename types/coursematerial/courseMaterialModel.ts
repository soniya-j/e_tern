import { Document } from 'mongoose';

export interface ICourseMaterial extends Document {
  courseMaterialName: string;
  subCategoryId: string;
  courseMaterialUrl: string;
  sorting: number;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  type: string;
}

export interface ICourseMaterialBody {
  courseMaterialName: string;
  subCategoryId: string;
  courseMaterialUrl: string;
  description?: string;
  sorting: number;
  type: string;
}

export interface ITrackCourseMaterialView extends Document {
  studentId: string;
  courseMaterialId: string;
  viewedPercentage?: number;
  isActive: boolean;
}

export interface ICourseMaterialWithStatus extends ICourseMaterialBody {
  _id: string;
  viewedStatus: boolean;
  openStatus: boolean;
}

export interface ICourseMaterialWatchHistoryBody extends Document {
  studentId: string;
  categoryId: string;
  subCategoryId: string;
  courseMaterialId: string;
  watchedDuration: number;
}