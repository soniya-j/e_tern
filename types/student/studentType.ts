import { Document } from 'mongoose';

export interface IStudent extends Document {
  fullName: string;
  dob: string;
  gender: string;
  avatar?: string;
  packageId?: string;
  userId: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  subscribed?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  status?: number;
}

export interface IStudentBody {
  fullName: string;
  dob: string;
  gender: string;
  avatar?: string;
  packageId: string;
  userId: string;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
}
