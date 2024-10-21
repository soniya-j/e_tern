import { Document } from 'mongoose';

export interface IActivityModel extends Document {
  title: string;
  shortDescription: string;
  category: string;
  userType: 'child' | 'teenager' | 'adult';
  isDeleted: boolean;
}

export interface IActivityResponse {
  _id: string;
  title: string;
  shortDescription: string;
  category: string;
}
