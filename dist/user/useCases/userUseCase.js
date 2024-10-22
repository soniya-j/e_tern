"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileUseCase = exports.sendOtpUseCase = exports.uploadAvatarUseCase = exports.verifyOtpUseCase = exports.registerUserUseCase = void 0;
const authentication_1 = require("../../authentication/authentication");
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const twilioService_1 = require("../../services/twilioService");
const registerUserRepo_1 = require("../repos/registerUserRepo");
const imageUploader_1 = require("../../utils/imageUploader");
const registerUserUseCase = async (data) => {
    //check userAlready exist
    const userExist = await (0, registerUserRepo_1.checkUserExist)(data.mobileNumber);
    //const userExist = await checkUserExist(data.fullName, data.mobileNumber);
    if (userExist)
        throw new appError_1.default('User Already Exist', httpStatus_1.HttpStatus.BAD_REQUEST);
    //send an otp to the mobileNumber provided
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //await sendOtp(data.mobileNumber, otp);
    //if not insert the data in database
    data.status = 1;
    await (0, registerUserRepo_1.createUser)(data, otp);
    return true;
};
exports.registerUserUseCase = registerUserUseCase;
const verifyOtpUseCase = async (data) => {
    const { mobileNumber, otp, deviceId, deviceType } = data;
    const otpCheck = await (0, registerUserRepo_1.verifyOtp)(mobileNumber, otp);
    if (!otpCheck)
        throw new appError_1.default('Invalid OTP', httpStatus_1.HttpStatus.BAD_REQUEST);
    await (0, registerUserRepo_1.setUserVerified)(otpCheck._id);
    const token = (0, authentication_1.generateToken)({ role: 'user', userId: otpCheck._id });
    await (0, registerUserRepo_1.saveUserToken)(otpCheck._id, deviceId, deviceType, token);
    return { token };
};
exports.verifyOtpUseCase = verifyOtpUseCase;
const uploadAvatarUseCase = async (file, userId) => {
    const imageUrl = await (0, imageUploader_1.processAndUploadImage)(file);
    // upload the avatar url to db using id from the token
    const upload = await (0, registerUserRepo_1.uploadAvatar)(userId, imageUrl);
    if (!upload)
        throw new appError_1.default('Image upload failed', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    return imageUrl;
};
exports.uploadAvatarUseCase = uploadAvatarUseCase;
const sendOtpUseCase = async (data) => {
    //check exists
    const userExist = await (0, registerUserRepo_1.checkUserNumberExist)(data.mobileNumber);
    if (!userExist)
        throw new appError_1.default('User Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await (0, twilioService_1.sendOtp)(data.mobileNumber, otp);
    await (0, registerUserRepo_1.updateUserOtp)(data.mobileNumber, otp);
    return otp;
};
exports.sendOtpUseCase = sendOtpUseCase;
const getProfileUseCase = async (userId) => {
    const result = await (0, registerUserRepo_1.getProfile)(userId);
    if (!result || result.length === 0) {
        throw new appError_1.default('No User found for the given user ID', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getProfileUseCase = getProfileUseCase;
