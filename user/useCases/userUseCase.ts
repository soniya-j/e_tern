import { generateToken } from '../../authentication/authentication';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
//import { sendOtp } from '../../services/twilioService';
import { IOtpBody, IUserBody, IUsers } from '../../types/user/userTypes';
import {
  checkUserExist,
  createUser,
  saveUserToken,
  setUserVerified,
  uploadAvatar,
  verifyOtp,
  checkUserNumberExist,
  updateUserOtp,
  getProfile,
  updateUser,
  checkMobileExist,
  getProfileById,
} from '../repos/registerUserRepo';

import { getCourseMaterialTrack } from '../../coursematerial/repos/courseMaterialRepo';

import { processAndUploadImage } from '../../utils/imageUploader';
import { createStudent } from '../../student/repos/studentRepo';
import { IStudentBody } from '../../types/student/studentType';

export const registerUserUseCase = async (data: IUserBody): Promise<Pick<IUsers, '_id'>> => {
  //check userAlready exist
  //const userExist = await checkUserExist(data.mobileNumber);
  const userExist = await checkUserExist(data.email ?? '', data.mobileNumber);
  if (userExist)
    throw new AppError('User Mobile Number/Email Already Exist', HttpStatus.BAD_REQUEST);
  //send an otp to the mobileNumber provided
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  //await sendOtp(data.mobileNumber, otp);
  data.status = 1;
  const result = await createUser(data, otp);

  const studentData: IStudentBody = {
    ...data,
    userId: result._id,
  };
  // Add the student data to the student collection
  await createStudent(studentData);

  return result;
};

export const verifyOtpUseCase = async (
  data: IOtpBody,
): Promise<{ token: string } & Omit<IUserBody, keyof Document>> => {
  const { mobileNumber, otp, deviceId, deviceType } = data;
  const otpCheck = await verifyOtp(mobileNumber, otp);
  if (!otpCheck) throw new AppError('Invalid OTP', HttpStatus.BAD_REQUEST);
  await setUserVerified(otpCheck._id);
  const token = generateToken({ role: 'user', userId: otpCheck._id });
  await saveUserToken(otpCheck._id, deviceId, deviceType, token);
  const result = await getProfileById(otpCheck._id);
  if (!result) throw new AppError('User profile not found', HttpStatus.NOT_FOUND);
  return { token, ...result };
};

export const uploadAvatarUseCase = async (
  file: Express.Multer.File,
  userId: string,
): Promise<string> => {
  const imageUrl = await processAndUploadImage(file);
  // upload the avatar url to db using id from the token
  const upload = await uploadAvatar(userId, imageUrl);
  if (!upload) throw new AppError('Image upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
  return imageUrl;
};

export const sendOtpUseCase = async (data: IOtpBody): Promise<string> => {
  //check exists
  const userExist = await checkUserNumberExist(data.mobileNumber);
  if (!userExist) throw new AppError('User Not Found', HttpStatus.BAD_REQUEST);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  //await sendOtp(data.mobileNumber, otp);

  await updateUserOtp(data.mobileNumber, otp);
  return otp;
};

export const getProfileUseCase = async (userId: string): Promise<IUserBody[]> => {
  const result = await getProfile(userId);
  if (!result || result.length === 0) {
    throw new AppError('No User found for the given user ID', HttpStatus.NOT_FOUND);
  }
  return result;
};

export const getCourseMaterialTrackUseCase = async (
  userId: string,
): Promise<{ totalMaterials: number; viewedMaterials: number; percentageViewed: number }> => {
  const result = await getCourseMaterialTrack(userId);
  return result;
};

export const updateUserUseCase = async (userId: string, data: IUserBody): Promise<IUserBody> => {
  const chkUser = await getProfile(userId);
  if (!chkUser || chkUser.length === 0) {
    throw new AppError('No User found for the given user ID', HttpStatus.NOT_FOUND);
  }
  const mobileExist = await checkMobileExist(data.mobileNumber, userId);
  if (mobileExist) throw new AppError('User Already Exist', HttpStatus.BAD_REQUEST);
  const result = await updateUser(userId, data);
  return result;
};
