import { Schema, model } from 'mongoose';
import { IUsers } from '../../types/user/userTypes';

const usersSchema = new Schema<IUsers>(
  {
    fullName: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    dob: { type: Date, required: true },
    userType: { type: String, enum: ['child', 'teenager', 'adult'], required: true },
    email: { type: String, required: true },
    parentName: { type: String },
    parentDob: { type: Date },
    avatar: { type: String, default: '' },
    otp: { type: String },
    interest: { type: String, default: '' },
    mobileNumberVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    password: { type: String, default: '' },
    role: { type: String },
    currentStudentId: { type: String, default: '' },
  },
  { timestamps: true },
);

const usersModel = model<IUsers>('Users', usersSchema);
export default usersModel;
