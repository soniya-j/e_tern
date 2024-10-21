"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = exports.uploadAvatar = exports.verifyOtp = exports.registerUser = void 0;
const userUseCase_1 = require("../useCases/userUseCase");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const localization_1 = require("../../config/localization");
const httpStatus_1 = require("../../common/httpStatus");
const express_validator_1 = require("express-validator");
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
    await (0, userUseCase_1.registerUserUseCase)(data);
    res.status(201).json({
        success: true,
        message: localization_1.responseMessages.registration_success,
        result: '',
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
    res.status(201).json({
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
    res.status(201).json({
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
    res.status(201).json({
        success: true,
        message: localization_1.responseMessages.otp_send_success,
        result,
    });
});
