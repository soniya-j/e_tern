"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.updateUserOtp = exports.checkUserNumberExist = exports.uploadAvatar = exports.saveUserToken = exports.setUserVerified = exports.verifyOtp = exports.createUser = exports.checkUserExist = void 0;
const objectIdParser_1 = require("../../utils/objectIdParser");
const userModel_1 = __importDefault(require("../models/userModel"));
const userAuthModel_1 = __importDefault(require("../models/userAuthModel"));
const checkUserExist = async (
//fullName: string,
mobileNumber) => {
    return await userModel_1.default
        //.findOne({ $or: [{ userName }, { mobileNumber }] })
        .findOne({ mobileNumber })
        .select({ _id: 1 })
        .lean();
};
exports.checkUserExist = checkUserExist;
const createUser = async (data, otp) => {
    await userModel_1.default.create({ ...data, otp });
    return true;
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
