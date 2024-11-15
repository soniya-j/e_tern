"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatecurrentStudent = exports.verifyParentDobYear = exports.updateParentDob = exports.createAdmin = exports.hashPassword = exports.verifyLogin = exports.getAllUsers = exports.getProfileById = exports.checkMobileExist = exports.updateUser = exports.checkUserIdExist = exports.getProfile = exports.updateUserOtp = exports.checkUserNumberExist = exports.uploadAvatar = exports.saveUserToken = exports.setUserVerified = exports.verifyOtp = exports.createUser = exports.checkUserExist = void 0;
const objectIdParser_1 = require("../../utils/objectIdParser");
const userModel_1 = __importDefault(require("../models/userModel"));
const userAuthModel_1 = __importDefault(require("../models/userAuthModel"));
const httpStatus_1 = require("../../common/httpStatus");
const appError_1 = __importDefault(require("../../common/appError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const objectIdParser_2 = require("../../utils/objectIdParser");
const checkUserExist = async (email, mobileNumber) => {
    return await userModel_1.default
        .findOne({ $or: [{ email }, { mobileNumber }] })
        .select({ _id: 1 })
        .lean();
};
exports.checkUserExist = checkUserExist;
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
    return await userModel_1.default.findOne({ _id: userId, isDeleted: false }).lean();
};
exports.getProfile = getProfile;
const checkUserIdExist = async (userId) => {
    const _id = (0, objectIdParser_1.ObjectID)(userId);
    return await userModel_1.default.findOne({ _id, isDeleted: false }).select({ _id: 1 }).lean();
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
const getProfileById = async (userId) => {
    return await userModel_1.default.findOne({ _id: userId, isDeleted: false }).lean();
};
exports.getProfileById = getProfileById;
const getAllUsers = async (filters, limit, page) => {
    const query = {};
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
    return await userModel_1.default.find(query).limit(limit).skip(skip).lean();
};
exports.getAllUsers = getAllUsers;
const verifyLogin = async (email, password) => {
    const user = await userModel_1.default
        .findOne({ email, isDeleted: false, status: 1 })
        .select({ _id: 1, password: 1 })
        .lean();
    if (!user)
        return null;
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    return isMatch ? { _id: (0, objectIdParser_2.objectIdToString)(user._id) } : null;
};
exports.verifyLogin = verifyLogin;
//Password hashing for user reg
const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcryptjs_1.default.hash(password, saltRounds);
};
exports.hashPassword = hashPassword;
const createAdmin = async (data) => {
    const user = await userModel_1.default.create(data);
    return { _id: user._id };
};
exports.createAdmin = createAdmin;
const updateParentDob = async (id, parentDob) => {
    const _id = (0, objectIdParser_1.ObjectID)(id);
    return await userModel_1.default.findOneAndUpdate({ _id }, { parentDob: parentDob }, { new: true });
};
exports.updateParentDob = updateParentDob;
const verifyParentDobYear = async (userId, year) => {
    const _id = (0, objectIdParser_1.ObjectID)(userId);
    const user = await userModel_1.default.findOne({ _id, isDeleted: false }, { parentDob: 1 });
    if (!user || !user.parentDob) {
        throw new appError_1.default('User or parent DOB not found', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const parentDobYear = new Date(user.parentDob).getFullYear();
    return parentDobYear === year;
};
exports.verifyParentDobYear = verifyParentDobYear;
const updatecurrentStudent = async (userId, studentId) => {
    const _id = (0, objectIdParser_1.ObjectID)(userId);
    return await userModel_1.default.findOneAndUpdate({ _id, isDeleted: false }, { currentStudentId: studentId }, { new: true });
};
exports.updatecurrentStudent = updatecurrentStudent;
