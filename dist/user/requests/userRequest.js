"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateValidation = exports.courseMaterialTrackValidation = exports.getProfileValidation = exports.sendOtpValidation = exports.verifyOtpValidation = exports.userRegisterValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.userRegisterValidation = [
    (0, express_validator_1.body)('fullName')
        .notEmpty()
        .withMessage('fullName is required')
        .isString()
        .withMessage('fullName must be a string'),
    (0, express_validator_1.body)('mobileNumber')
        .notEmpty()
        .withMessage('mobileNumber is required')
        .isNumeric()
        .withMessage('mobileNumber must be a number'),
    (0, express_validator_1.body)('dob')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isDate()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('userType')
        .notEmpty()
        .withMessage('userType is required')
        .isIn(['child', 'teenager', 'adult'])
        .withMessage('Invalid userType'),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('Invalid email format'),
];
exports.verifyOtpValidation = [
    (0, express_validator_1.body)('mobileNumber')
        .notEmpty()
        .withMessage('mobileNumber is required')
        .isNumeric()
        .withMessage('mobileNumber must be a number'),
    (0, express_validator_1.body)('otp')
        .notEmpty()
        .withMessage('otp is required')
        .isString()
        .withMessage('otp must be a string'),
    (0, express_validator_1.body)('deviceId')
        .notEmpty()
        .withMessage('deviceId is required')
        .isString()
        .withMessage('deviceId must be a string'),
    (0, express_validator_1.body)('deviceType')
        .notEmpty()
        .withMessage('deviceType is required')
        .isString()
        .withMessage('deviceType must be a string'),
];
exports.sendOtpValidation = [
    (0, express_validator_1.body)('mobileNumber')
        .notEmpty()
        .withMessage('mobileNumber is required')
        .isNumeric()
        .withMessage('mobileNumber must be a number'),
];
exports.getProfileValidation = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('Invalid userId format')
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid userId format');
        }
        return true;
    }),
];
exports.courseMaterialTrackValidation = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('Invalid userId format')
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid userId format');
        }
        return true;
    }),
];
exports.userUpdateValidation = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('Invalid userId format')
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid userId format');
        }
        return true;
    }),
    (0, express_validator_1.body)('fullName').optional().isString().withMessage('fullName must be a string'),
    (0, express_validator_1.body)('mobileNumber').optional().isNumeric().withMessage('mobileNumber must be a number'),
    (0, express_validator_1.body)('dob').optional().isDate().withMessage('Invalid date format'),
    (0, express_validator_1.body)('userType').optional().isIn(['child', 'teenager', 'adult']).withMessage('Invalid userType'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('parentName').optional().isString().withMessage('parentName must be a string'),
    (0, express_validator_1.body)('parentDob').optional().isDate().withMessage('Invalid date format for parentDob'),
    (0, express_validator_1.body)('interest').optional().isString().withMessage('interest must be a string'),
];
