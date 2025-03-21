"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCountUseCase = exports.logoutUseCase = exports.switchStudentUseCase = exports.verifyParentDobUseCase = exports.updateParentDobUseCase = exports.registerAdminUseCase = exports.loginUseCase = exports.getUsersUseCase = exports.updateUserUseCase = exports.getCourseMaterialTrackUseCase = exports.getProfileUseCase = exports.sendOtpUseCase = exports.uploadAvatarUseCase = exports.verifyOtpUseCase = exports.registerUserUseCase = void 0;
const authentication_1 = require("../../authentication/authentication");
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const registerUserRepo_1 = require("../repos/registerUserRepo");
const courseMaterialRepo_1 = require("../../coursematerial/repos/courseMaterialRepo");
const imageUploader_1 = require("../../utils/imageUploader");
const studentRepo_1 = require("../../student/repos/studentRepo");
const studentRepo_2 = require("../../student/repos/studentRepo");
const registerUserUseCase = async (data) => {
    //check userAlready exist
    const userExist = await (0, registerUserRepo_1.checkUserExist)(data.email ?? '', data.mobileNumber);
    if (userExist)
        throw new appError_1.default('User Mobile Number/Email Already Exist', httpStatus_1.HttpStatus.BAD_REQUEST);
    //send an otp to the mobileNumber provided
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //await sendOtp(data.mobileNumber, otp);
    data.status = 1;
    data.role = 'user';
    const result = await (0, registerUserRepo_1.createUser)(data, otp);
    const studentData = {
        ...data,
        userId: result._id,
    };
    // Add the student data to the student collection
    const studentResult = await (0, studentRepo_1.createStudent)(studentData);
    // Update the student id to the user collection
    await (0, registerUserRepo_1.updatecurrentStudent)(result._id, studentResult._id);
    return result;
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
    const result = await (0, registerUserRepo_1.getProfileById)(otpCheck._id);
    if (!result)
        throw new appError_1.default('User profile not found', httpStatus_1.HttpStatus.NOT_FOUND);
    const studentDetails = await (0, studentRepo_2.getStudentById)(result.currentStudentId);
    if (!studentDetails) {
        throw new appError_1.default('No student found for the given studentId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return {
        token,
        ...result,
        studentDetails,
    };
};
exports.verifyOtpUseCase = verifyOtpUseCase;
const uploadAvatarUseCase = async (file, studentId) => {
    const imageUrl = await (0, imageUploader_1.processAndUploadImage)(file, 'avatar');
    // upload the avatar url to db using id from the token
    const upload = await (0, registerUserRepo_1.uploadAvatar)(studentId, imageUrl);
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
    //await sendOtp(data.mobileNumber, otp);
    /* OTP Email
    const emailId = 'soniyaej@gmail.com';
    const brevoService = new BrevoService();
    await brevoService.sendEmail(emailId, 'Your OTP Code', `Your OTP is: ${otp}`);
    */
    await (0, registerUserRepo_1.updateUserOtp)(data.mobileNumber, otp);
    return otp;
};
exports.sendOtpUseCase = sendOtpUseCase;
const getProfileUseCase = async (userId) => {
    const result = await (0, registerUserRepo_1.getProfile)(userId);
    if (!result) {
        throw new appError_1.default('No User found for the given user ID', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const studentDetails = await (0, studentRepo_2.getStudentById)(result.currentStudentId);
    if (!studentDetails) {
        throw new appError_1.default('No student found for the given studentId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return {
        ...result,
        studentDetails,
    };
};
exports.getProfileUseCase = getProfileUseCase;
const getCourseMaterialTrackUseCase = async (userId) => {
    const result = await (0, courseMaterialRepo_1.getCourseMaterialTrack)(userId);
    return result;
};
exports.getCourseMaterialTrackUseCase = getCourseMaterialTrackUseCase;
const updateUserUseCase = async (userId, data) => {
    const chkUser = await (0, registerUserRepo_1.getProfile)(userId);
    if (!chkUser) {
        throw new appError_1.default('No User found for the given user ID', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const chkDataExist = await (0, registerUserRepo_1.checkMobileEmailExist)(data.mobileNumber, userId, data.email);
    if (chkDataExist)
        throw new appError_1.default('User Mobile Number/Email Exist', httpStatus_1.HttpStatus.BAD_REQUEST);
    const userData = {
        mobileNumber: data.mobileNumber,
        dob: data.dob,
        email: data.email,
        parentDob: data.parentDob,
        parentName: data.parentName,
        interest: data.interest,
    };
    const result = await (0, registerUserRepo_1.updateUser)(userId, userData);
    const studentData = {
        fullName: data.fullName,
        dob: data.dob,
        gender: data.gender,
    };
    const studentDetails = await (0, studentRepo_1.updateStudent)(result.currentStudentId, studentData);
    return {
        ...result,
        studentDetails,
    };
};
exports.updateUserUseCase = updateUserUseCase;
const getUsersUseCase = async (filters, limit, page) => {
    const result = await (0, registerUserRepo_1.getAllUsers)(filters, limit, page);
    if (!result.data || result.data.length === 0) {
        throw new appError_1.default('No Users found', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getUsersUseCase = getUsersUseCase;
const loginUseCase = async (data) => {
    const { email, password } = data;
    const check = await (0, registerUserRepo_1.verifyLogin)(email, password);
    if (!check)
        throw new appError_1.default('Invalid Email/Password', httpStatus_1.HttpStatus.BAD_REQUEST);
    const token = (0, authentication_1.generateToken)({ role: 'admin', userId: check._id });
    //await saveUserToken(otpCheck._id, deviceId, deviceType, token);
    const result = await (0, registerUserRepo_1.getProfileById)(check._id);
    if (!result)
        throw new appError_1.default('User profile not found', httpStatus_1.HttpStatus.NOT_FOUND);
    return { token, ...result };
};
exports.loginUseCase = loginUseCase;
const registerAdminUseCase = async (data) => {
    //check userAlready exist
    const userExist = await (0, registerUserRepo_1.checkUserExist)(data.email ?? '', data.mobileNumber);
    if (userExist)
        throw new appError_1.default('User Mobile Number/Email Already Exist', httpStatus_1.HttpStatus.BAD_REQUEST);
    data.status = 1;
    data.role = 'admin';
    const hashedPassword = await (0, registerUserRepo_1.hashPassword)(data.password);
    data.password = hashedPassword;
    const result = await (0, registerUserRepo_1.createAdmin)(data);
    return result;
};
exports.registerAdminUseCase = registerAdminUseCase;
const updateParentDobUseCase = async (userId, parentDob, parentName) => {
    const chkUser = await (0, registerUserRepo_1.checkUserIdExist)(userId);
    if (!chkUser) {
        throw new appError_1.default('No User found for the given user ID', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const result = await (0, registerUserRepo_1.updateParentDob)(userId, parentDob, parentName);
    if (!result) {
        throw new appError_1.default('Failed to update parent DOB', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { _id: result._id };
};
exports.updateParentDobUseCase = updateParentDobUseCase;
const verifyParentDobUseCase = async (userId, parentDobYear) => {
    const result = await (0, registerUserRepo_1.verifyParentDobYear)(userId, parentDobYear);
    if (!result) {
        throw new appError_1.default('Invalid Secret Key', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
};
exports.verifyParentDobUseCase = verifyParentDobUseCase;
const switchStudentUseCase = async (userId, studentId) => {
    const studentExists = await (0, studentRepo_2.findStudentExists)(studentId, userId);
    if (!studentExists) {
        throw new appError_1.default('No profile found for the given studentId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const result = await (0, registerUserRepo_1.updatecurrentStudent)(userId, studentId);
    if (!result) {
        throw new appError_1.default('Student profile not found', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
};
exports.switchStudentUseCase = switchStudentUseCase;
const logoutUseCase = async (userId, deviceType) => {
    const result = await (0, registerUserRepo_1.deleteToken)(userId, deviceType);
    if (!result) {
        throw new appError_1.default('Token not found or already invalidated.', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
};
exports.logoutUseCase = logoutUseCase;
const getUserCountUseCase = async () => {
    const totalUsers = await (0, studentRepo_2.getStudentCount)();
    const totalStudents = await (0, studentRepo_2.getSubscribedStudentCount)();
    const { registeredThisMonth, subscribedThisMonth, freeUsersThisMonth } = await (0, studentRepo_2.getCurrentMonthActivities)();
    return {
        totalUsers,
        totalStudents,
        registeredThisMonth,
        subscribedThisMonth,
        freeUsersThisMonth,
    };
};
exports.getUserCountUseCase = getUserCountUseCase;
