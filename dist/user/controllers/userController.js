"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchStudent = exports.verifyParentDob = exports.updateParentDob = exports.registerAdmin = exports.login = exports.getUsers = exports.updateProfile = exports.courseMaterialTrack = exports.getProfile = exports.sendOtp = exports.uploadAvatar = exports.verifyOtp = exports.registerUser = void 0;
const userUseCase_1 = require("../useCases/userUseCase");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const localization_1 = require("../../config/localization");
const httpStatus_1 = require("../../common/httpStatus");
const express_validator_1 = require("express-validator");
const appError_1 = __importDefault(require("../../common/appError"));
exports.registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const data = req.body;
    const result = await (0, userUseCase_1.registerUserUseCase)(data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.registration_success,
        result: result,
    });
});
exports.verifyOtp = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const data = req.body;
    const result = await (0, userUseCase_1.verifyOtpUseCase)(data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.otp_verify_success,
        result,
    });
});
const uploadAvatar = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: 'fail', error: 'No file uploaded.' });
    }
    if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
        return res.status(400).json({ status: 'fail', error: 'Unsupported file type' });
    }
    if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ status: 'fail', error: 'file size exceeded' });
    }
    const userId = res.locals.userId; // get userId from locals ( using JWT middleware )
    if (!userId || userId === '') {
        return res.status(401).send('Unauthorized');
    }
    const imageUrl = await (0, userUseCase_1.uploadAvatarUseCase)(req.file, userId);
    res.status(200).json({
        status: 'success',
        message: 'image uploaded successfully',
        result: imageUrl,
    });
};
exports.uploadAvatar = uploadAvatar;
exports.sendOtp = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const data = req.body;
    const result = await (0, userUseCase_1.sendOtpUseCase)(data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.otp_send_success,
        result,
    });
});
const getProfile = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    try {
        const { userId, studentId } = req.params;
        const result = await (0, userUseCase_1.getProfileUseCase)(userId, studentId);
        return res.status(200).json({
            success: true,
            message: localization_1.responseMessages.response_success_get,
            result: result,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: localization_1.responseMessages.unexpected_error,
        });
    }
};
exports.getProfile = getProfile;
const courseMaterialTrack = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    try {
        const { userId } = req.params;
        const result = await (0, userUseCase_1.getCourseMaterialTrackUseCase)(userId);
        return res.status(200).json({
            success: true,
            message: localization_1.responseMessages.response_success_get,
            result: result,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: localization_1.responseMessages.unexpected_error,
        });
    }
};
exports.courseMaterialTrack = courseMaterialTrack;
exports.updateProfile = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const { userId } = req.params;
    const data = req.body;
    const result = await (0, userUseCase_1.updateUserUseCase)(userId, data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_put,
        result: result,
    });
});
const getUsers = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
    }
    try {
        const filters = {
            fullName: req.query.fullName,
            mobileNumber: req.query.mobileNumber
                ? parseInt(req.query.mobileNumber, 10)
                : undefined,
            status: req.query.status ? parseInt(req.query.status) : undefined,
        };
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const result = await (0, userUseCase_1.getUsersUseCase)(filters, limit, page);
        return res.status(200).json({
            success: true,
            message: 'Fetch users successfully',
            result,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
};
exports.getUsers = getUsers;
exports.login = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const data = req.body;
    const result = await (0, userUseCase_1.loginUseCase)(data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.login_success,
        result,
    });
});
exports.registerAdmin = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const data = req.body;
    const result = await (0, userUseCase_1.registerAdminUseCase)(data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.registration_success,
        result: result,
    });
});
exports.updateParentDob = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const { userId } = req.params;
    const { parentDob, parentName } = req.body;
    const result = await (0, userUseCase_1.updateParentDobUseCase)(userId, parentDob, parentName);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_put,
        result: result,
    });
});
exports.verifyParentDob = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const { userId, parentDobYear } = req.body;
    const result = await (0, userUseCase_1.verifyParentDobUseCase)(userId, parentDobYear);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.verify_success,
        result,
    });
});
exports.switchStudent = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const userId = res.locals.userId;
    const { studentId } = req.params;
    const result = await (0, userUseCase_1.switchStudentUseCase)(userId, studentId);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.msg_success,
        result,
    });
});
