"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileById = exports.checkMobileExist = exports.updateUser = exports.checkUserIdExist = exports.getProfile = exports.updateUserOtp = exports.checkUserNumberExist = exports.uploadAvatar = exports.saveUserToken = exports.setUserVerified = exports.verifyOtp = exports.createUser = exports.checkUserExist = void 0;
const objectIdParser_1 = require("../../utils/objectIdParser");
const userModel_1 = __importDefault(require("../models/userModel"));
const userAuthModel_1 = __importDefault(require("../models/userAuthModel"));
const httpStatus_1 = require("../../common/httpStatus");
const appError_1 = __importDefault(require("../../common/appError"));
const checkUserExist = async (email, mobileNumber) => {
    return await userModel_1.default
        .findOne({ $or: [{ email }, { mobileNumber }] })
        .select({ _id: 1 })
        .lean();
};
exports.checkUserExist = checkUserExist;
/*
export const createUser = async (data: IUserBody, otp: string): Promise<Pick<IUsers, '_id'>> => {
  const user = await usersModel.create({ ...data, otp });
  return { _id: user._id };
};
*/
const createUser = async (data, otp) => {
    const user = await userModel_1.default.create({ ...data, otp });
    return { _id: user._id, otp };
};
exports.createUser = createUser;
const verifyOtp = async (mobileNumber, otp) => {
    return await userModel_1.default
        .findOne({ mobileNumber, otp, isDeleted: false })
        .select({ _id: 1 })
        .lean();
};
exports.verifyOtp = verifyOtp;
const setUserVerified = async (id) => {
    const _id = (0, objectIdParser_1.ObjectID)(id);
    return await userModel_1.default.findOneAndUpdate({ _id, isDeleted: false }, { mobileNumberVerified: true, otp: '' }, { new: true });
};
exports.setUserVerified = setUserVerified;
const saveUserToken = async (userId, deviceId, deviceType, authToken) => {
    const existingSession = await userAuthModel_1.default.findOne({
        userId,
        deviceType,
        isActive: true,
    });
    if (!existingSession) {
        return await userAuthModel_1.default.create({ userId, deviceId, deviceType, authToken, isActive: true });
    }
    else {
        return await userAuthModel_1.default.findOneAndUpdate({ userId, deviceType, isActive: true }, { authToken, deviceId }, { new: true });
    }
};
exports.saveUserToken = saveUserToken;
const uploadAvatar = async (id, imageUrl) => {
    const _id = (0, objectIdParser_1.ObjectID)(id);
    return await userModel_1.default.findOneAndUpdate({ _id, isDeleted: false }, { avatar: imageUrl }, { new: true });
};
exports.uploadAvatar = uploadAvatar;
const checkUserNumberExist = async (mobileNumber) => {
    return await userModel_1.default
        .findOne({ mobileNumber, isDeleted: false, status: 1 })
        .select({ _id: 1 })
        .lean();
};
exports.checkUserNumberExist = checkUserNumberExist;
const updateUserOtp = async (mobileNumber, otp) => {
    return await userModel_1.default.findOneAndUpdate({ mobileNumber, isDeleted: false, status: 1 }, { otp: otp });
};
exports.updateUserOtp = updateUserOtp;
const getProfile = async (userId) => {
    return await userModel_1.default.findOne({ _id: userId }).lean();
};
exports.getProfile = getProfile;
const checkUserIdExist = async (userId) => {
    return await userModel_1.default.findOne({ _id: userId }).select({ _id: 1 }).lean();
};
exports.checkUserIdExist = checkUserIdExist;
const updateUser = async (id, data) => {
    const _id = (0, objectIdParser_1.ObjectID)(id);
    const obj = { modifiedOn: new Date().toISOString(), ...data };
    const updatedData = await userModel_1.default.findOneAndUpdate({ _id }, obj, {
        new: true,
    });
    if (!updatedData) {
        throw new appError_1.default('Something went wrong', httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    return updatedData;
};
exports.updateUser = updateUser;
const checkMobileExist = async (mobileNumber, userId) => {
    return await userModel_1.default
        .findOne({
        mobileNumber,
        _id: { $ne: userId },
    })
        .select({ _id: 1 })
        .lean();
};
exports.checkMobileExist = checkMobileExist;
/*

export const getProfileById = async (
  userId: string
): Promise<Partial<IUsers> & { _id: string; fullName: string; mobileNumber: number; email: string; status: number }> => {
  const profile = await usersModel
    .findOne({ _id: userId })
    .select({ _id: 1, fullName: 1, mobileNumber: 1, email: 1, status: 1 })
    .lean();
  return profile as Partial<IUsers> & { _id: string; fullName: string; mobileNumber: number; email: string; status: number };
};

export const getProfileById = async (userId: string): Promise<Partial<IUsers> & { _id: string }> => {
  const profile = await usersModel.findOne({ _id: userId }, '_id fullName mobileNumber dob userType email mobileNumberVerified status').lean();
  return profile as Partial<IUsers> & { _id: string };
};
*/
const getProfileById = async (userId) => {
    return await userModel_1.default.findOne({ _id: userId }).lean();
};
exports.getProfileById = getProfileById;
