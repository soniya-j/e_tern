import { Document } from 'mongoose';

export interface IUsers extends Document {
  fullName: string;
  mobileNumber: number;
  dob: Date;
  userType: 'child' | 'teenager' | 'adult';
  email?: string;
  parentName?: string;
  parentDob?: Date;
  avatar?: string;
  otp?: string;
  mobileNumberVerified?: boolean;
  isDeleted?: boolean;
  gender: string;
  interest?: string;
  status?: number;
}

export interface IUserAuth extends Document {
  userId: string;
  deviceId: string;
  deviceType: string;
  authToken: string;
  isActive: boolean;
}

export interface IUserBody {
  fullName: string;
  mobileNumber: number;
  dob: Date;
  userType: 'child' | 'teenager' | 'adult';
  email?: string;
  parentName?: string;
  parentDob?: Date;
  gender: string;
  status?: number;
}

export interface IOtpBody {
  mobileNumber: number;
  otp: string;
  deviceId: string;
  deviceType: 'web' | 'mobile';
}
