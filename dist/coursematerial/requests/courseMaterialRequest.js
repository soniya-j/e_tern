"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackCourseMaterialValidation = exports.getCourseMaterialBySubCategoryIdValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
exports.getCourseMaterialBySubCategoryIdValidation = [
    (0, express_validator_1.param)('subCategoryId')
        .notEmpty()
        .withMessage('subCategoryId is required')
        .isMongoId()
        .withMessage('Invalid subCategoryId format'),
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
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isString()
        .withMessage('userId must be a string')
        .custom((value) => {
        if (!mongoose_1.default.Types.ObjectId.isValid(value)) {
            throw new Error('Invalid userId format');
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
