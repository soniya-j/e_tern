"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackCourseMaterialValidation = exports.getCourseMaterialBySubCategoryIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getCourseMaterialBySubCategoryIdValidation = [
    (0, express_validator_1.param)('subCategoryId')
        .notEmpty()
        .withMessage('subCategoryId is required')
        .isMongoId()
        .withMessage('Invalid subCategoryId format'),
];
exports.trackCourseMaterialValidation = [
    (0, express_validator_1.body)('courseMaterialId')
        .notEmpty()
        .withMessage('mobileNumber is required')
        .isString()
        .withMessage('courseMaterialId must be a number'),
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isString()
        .withMessage('userId must be a string'),
    /*
    body('viewedPercentage')
      .notEmpty()
      .withMessage('viewedPercentage is required')
      .isNumber()
      .withMessage('viewedPercentage must be a string'),
      */
];
