import { IUserAuth, IUserBody, IUsers, IAdminBody } from '../../types/user/userTypes';
import { ObjectID } from '../../utils/objectIdParser';
import usersModel from '../models/userModel';
import userAuthModel from '../models/userAuthModel';
import { HttpStatus } from '../../common/httpStatus';
import AppError from '../../common/appError';
import bcrypt from 'bcryptjs';
import { objectIdToString } from '../../utils/objectIdParser';
import { ObjectId } from 'mongodb';

export const checkUserExist = async (
  email: string,
  mobileNumber: number,
): Promise<{ _id: string } | null> => {
  return await usersModel
    .findOne({ $or: [{ email }, { mobileNumber }] })
    .select({ _id: 1 })
    .lean();
};

export const createUser = async (
  data: IUserBody,
  otp: string,
): Promise<{ _id: string; otp: string }> => {
  const user = await usersModel.create({ ...data, otp });
  return { _id: user._id as string, otp };
};

export const verifyOtp = async (
  mobileNumber: number,
  otp: string,
): Promise<{ _id: string } | null> => {
  return await usersModel
    .findOne({ mobileNumber, otp, isDeleted: false })
    .select({ _id: 1 })
    .lean();
};

export const setUserVerified = async (id: string): Promise<{ _id: string } | null> => {
  const _id = ObjectID(id);
  return await usersModel.findOneAndUpdate(
    { _id, isDeleted: false },
    { mobileNumberVerified: true, otp: '' },
    { new: true },
  );
};

export const saveUserToken = async (
  userId: string,
  deviceId: string,
  deviceType: string,
  authToken: string,
): Promise<IUserAuth | null> => {
  const existingSession = await userAuthModel.findOne({
    userId,
    deviceType,
    isActive: true,
  });
  if (!existingSession) {
    return await userAuthModel.create({ userId, deviceId, deviceType, authToken, isActive: true });
  } else {
    return await userAuthModel.findOneAndUpdate(
      { userId, deviceType, isActive: true },
      { authToken, deviceId },
      { new: true },
    );
  }
};

export const uploadAvatar = async (
  id: string,
  imageUrl: string,
): Promise<{ _id: string } | null> => {
  const _id = ObjectID(id);
  return await usersModel.findOneAndUpdate(
    { _id, isDeleted: false },
    { avatar: imageUrl },
    { new: true },
  );
};

export const checkUserNumberExist = async (
  mobileNumber: number,
): Promise<{ _id: string } | null> => {
  return await usersModel
    .findOne({ mobileNumber, isDeleted: false, status: 1 })
    .select({ _id: 1 })
    .lean();
};

export const updateUserOtp = async (
  mobileNumber: number,
  otp: string,
): Promise<{ _id: string } | null> => {
  return await usersModel.findOneAndUpdate(
    { mobileNumber, isDeleted: false, status: 1 },
    { otp: otp },
  );
};

export const getProfile = async (userId: string): Promise<IUsers[] | null> => {
  return await usersModel.findOne({ _id: userId, isDeleted: false }).lean();
};

export const checkUserIdExist = async (userId: string): Promise<{ _id: string } | null> => {
  const _id = ObjectID(userId);
  return await usersModel.findOne({ _id, isDeleted: false }).select({ _id: 1 }).lean();
};

export const updateUser = async (id: string, data: IUserBody): Promise<IUserBody> => {
  const _id = ObjectID(id);
  const obj = { modifiedOn: new Date().toISOString(), ...data };
  const updatedData = await usersModel.findOneAndUpdate({ _id }, obj, {
    new: true,
  });
  if (!updatedData) {
    throw new AppError('Something went wrong', HttpStatus.BAD_REQUEST);
  }
  return updatedData;
};

export const checkMobileExist = async (
  mobileNumber: number,
  userId: string,
): Promise<{ _id: string } | null> => {
  return await usersModel
    .findOne({
      mobileNumber,
      _id: { $ne: userId },
    })
    .select({ _id: 1 })
    .lean();
};

export const getProfileById = async (userId: string): Promise<IUserBody | null> => {
  return await usersModel.findOne({ _id: userId, isDeleted: false }).lean();
};

export const getAllUsers = async (
  filters: Partial<IUserBody>,
  limit: number,
  page: number,
): Promise<IUsers[] | null> => {
  const query: any = {};
  if (filters.fullName) {
    query.fullName = { $regex: filters.fullName, $options: 'i' }; // Case-insensitive search
  }
  if (filters.mobileNumber) {
    query.mobileNumber = filters.mobileNumber;
  }
  if (filters.status !== undefined) {
    query.status = filters.status;
  }
  // query.subscribed = true; // Example of a subscription filter if needed
  const skip = (page - 1) * limit;
  return await usersModel.find(query).limit(limit).skip(skip).lean();
};

export const verifyLogin = async (
  email: string,
  password: string,
): Promise<{ _id: string } | null> => {
  const user = await usersModel
    .findOne({ email, isDeleted: false, status: 1 })
    .select({ _id: 1, password: 1 })
    .lean();
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password as string);
  return isMatch ? { _id: objectIdToString(user._id as ObjectId) } : null;
};

//Password hashing for user reg
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const createAdmin = async (data: IAdminBody): Promise<{ _id: string }> => {
  const user = await usersModel.create(data);
  return { _id: user._id as string };
};

export const updateParentDob = async (
  id: string,
  parentDob: Date,
): Promise<{ _id: string } | null> => {
  const _id = ObjectID(id);
  return await usersModel.findOneAndUpdate({ _id }, { parentDob: parentDob }, { new: true });
};

export const verifyParentDobYear = async (userId: string, year: number): Promise<boolean> => {
  const _id = ObjectID(userId);
  const user = await usersModel.findOne({ _id, isDeleted: false }, { parentDob: 1 });
  if (!user || !user.parentDob) {
    throw new AppError('User or parent DOB not found', HttpStatus.NOT_FOUND);
  }
  const parentDobYear = new Date(user.parentDob).getFullYear();
  return parentDobYear === year;
};
