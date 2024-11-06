"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentUpdateValidation = exports.studentAddValidation = exports.getStudentsByUserIdValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.getStudentsByUserIdValidation = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('Invalid userId format'),
];
exports.studentAddValidation = [
    (0, express_validator_1.body)('fullName')
        .notEmpty()
        .withMessage('fullName is required')
        .isString()
        .withMessage('fullName must be a string'),
    (0, express_validator_1.body)('dob')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isDate()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('gender')
        .notEmpty()
        .withMessage('gender is required')
        .isIn(['male', 'female'])
        .withMessage('Invalid gender'),
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('Invalid userId format'),
];
exports.studentUpdateValidation = [
    (0, express_validator_1.param)('studentId')
        .notEmpty()
        .withMessage('studentId is required')
        .isMongoId()
        .withMessage('Invalid studentId format')
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid studentId format');
        }
        return true;
    }),
    (0, express_validator_1.body)('fullName')
        .notEmpty()
        .withMessage('fullName is required')
        .isString()
        .withMessage('fullName must be a string'),
    (0, express_validator_1.body)('dob')
        .notEmpty()
        .withMessage('Date of birth is required')
        .isDate()
        .withMessage('Invalid date format'),
    (0, express_validator_1.body)('gender')
        .notEmpty()
        .withMessage('gender is required')
        .isIn(['male', 'female'])
        .withMessage('Invalid gender'),
];
