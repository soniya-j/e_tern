"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpValidation = exports.verifyOtpValidation = exports.userRegisterValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userRegisterValidation = [
    (0, express_validator_1.body)('userName')
        .notEmpty()
        .withMessage('userName is required')
        .isString()
        .withMessage('userName must be a string'),
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
    //body('parentName').optional().isString().withMessage('parentName must be a string'),
    //body('parentDob').optional().isDate().withMessage('Invalid date format for parentDob'),
    //body('interest').optional().isString().withMessage('interest must be a string'),
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
