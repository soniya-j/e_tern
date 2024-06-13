import { Document } from 'mongoose';

export interface IUsers extends Document {
  userName: string;
  mobileNumber: number;
  dob: string;
  userType: 'child' | 'teenager' | 'adult';
  email?: string;
  parentName?: string;
  parentDob?: string;
  avatar?: string;
  otp?: string;
  mobileNumberVerified?: boolean;
  isDeleted?: boolean;
}

export interface IUserBody {
  userName: string;
  mobileNumber: number;
  dob: string;
  userType: 'child' | 'teenager' | 'adult';
  email?: string;
  parentName?: string;
  parentDob?: string;
}

export interface IOtpBody {
  mobileNumber: number;
  otp: string;
}
