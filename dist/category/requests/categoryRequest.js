"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryUpdateValidation = exports.categoryCreateValidation = exports.getCategoryByPackageIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getCategoryByPackageIdValidation = [
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
exports.categoryCreateValidation = [
    (0, express_validator_1.body)('categoryName')
        .notEmpty()
        .withMessage('categoryName is required')
        .isString()
        .withMessage('categoryName must be a string'),
    (0, express_validator_1.body)('packageId')
        .notEmpty()
        .withMessage('packageId is required')
        .isMongoId()
        .withMessage('Invalid packageId format'),
    (0, express_validator_1.body)('imageUrl')
        .notEmpty()
        .withMessage('imageUrl is required')
        .isString()
        .withMessage('imageUrl must be a string'),
    (0, express_validator_1.body)('categoryName')
        .notEmpty()
        .withMessage('categoryName is required')
        .isString()
        .withMessage('categoryName must be a string'),
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
exports.categoryUpdateValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid category ID format'),
];
