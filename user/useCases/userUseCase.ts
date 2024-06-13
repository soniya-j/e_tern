import { generateToken } from '../../authentication/authentication';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
// import { sendOtp } from '../../services/twilioService';
import { IOtpBody, IUserBody } from '../../types/user/userTypes';
import {
  checkUserExist,
  createUser,
  setUserVerified,
  uploadAvatar,
  verifyOtp,
} from '../repos/registerUserRepo';
import { processAndUploadImage } from '../../utils/imageUploader';

export const registerUserUseCase = async (data: IUserBody): Promise<boolean> => {
  //check userAlready exist
  const userExist = await checkUserExist(data.userName, data.mobileNumber);
  if (userExist) throw new AppError('User Already Exist', HttpStatus.BAD_REQUEST);
  //send an otp to the mobileNumber provided
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // await sendOtp(data.mobileNumber, otp);
  //if not insert the data in database
  await createUser(data, otp);
  return true;
};

export const verifyOtpUseCase = async (data: IOtpBody): Promise<{ token: string }> => {
  const { mobileNumber, otp } = data;
  const otpCheck = await verifyOtp(mobileNumber, otp);
  if (!otpCheck) throw new AppError('Invalid OTP', HttpStatus.BAD_REQUEST);
  await setUserVerified(otpCheck._id);
  const token = generateToken({ role: 'user', userId: otpCheck._id });
  return { token };
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
