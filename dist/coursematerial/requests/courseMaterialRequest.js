"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseMaterialUpdateValidation = exports.courseMaterialCreateValidation = exports.trackCourseMaterialValidation = exports.getCourseMaterialBySubCategoryIdValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.getCourseMaterialBySubCategoryIdValidation = [
    (0, express_validator_1.param)('subCategoryId')
        .notEmpty()
        .withMessage('subCategoryId is required')
        .isMongoId()
        .withMessage('Invalid subCategoryId format'),
    (0, express_validator_1.param)('studentId')
        .notEmpty()
        .withMessage('studentId is required')
        .isMongoId()
        .withMessage('Invalid studentId format'),
    (0, express_validator_1.param)('type')
        .notEmpty()
        .withMessage('type is required')
        .isIn(['kid', 'parent'])
        .withMessage('type must be either "kid" or "parent"'),
];
exports.trackCourseMaterialValidation = [
    (0, express_validator_1.body)('courseMaterialId')
        .notEmpty()
        .withMessage('mobileNumber is required')
        .isString()
        .withMessage('courseMaterialId must be a number')
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid courseMaterialId format');
        }
        return true;
    }),
    (0, express_validator_1.body)('studentId')
        .notEmpty()
        .withMessage('studentId is required')
        .isString()
        .withMessage('studentId must be a string')
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid studentId format');
        }
        return true;
    }),
    /*
    body('viewedPercentage')
      .notEmpty()
      .withMessage('viewedPercentage is required')
      .isNumber()
      .withMessage('viewedPercentage must be a string'),
      */
];
exports.courseMaterialCreateValidation = [
    (0, express_validator_1.body)('courseMaterialName')
        .notEmpty()
        .withMessage('courseMaterialName is required')
        .isString()
        .withMessage('courseMaterialName must be a string'),
    (0, express_validator_1.body)('subCategoryId')
        .notEmpty()
        .withMessage('subCategoryId is required')
        .isMongoId()
        .withMessage('Invalid subCategoryId format'),
    (0, express_validator_1.body)('courseMaterialUrl')
        .notEmpty()
        .withMessage('courseMaterialUrl is required')
        .isString()
        .withMessage('courseMaterialUrl must be a string'),
    (0, express_validator_1.body)('sorting')
        .notEmpty()
        .withMessage('sorting is required')
        .isNumeric()
        .withMessage('sorting must be a number'),
    (0, express_validator_1.body)('type')
        .notEmpty()
        .withMessage('type is required')
        .isIn(['kid', 'parent'])
        .withMessage('type must be either "kid" or "parent"'),
];
exports.courseMaterialUpdateValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid courseMaterial ID format'),
];
