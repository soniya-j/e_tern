"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subCategoryUpdateValidation = exports.subCategoryCreateValidation = exports.getSubCategoryByCategoryIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getSubCategoryByCategoryIdValidation = [
    (0, express_validator_1.param)('categoryId')
        .notEmpty()
        .withMessage('categoryId is required')
        .isMongoId()
        .withMessage('Invalid categoryId format'),
    (0, express_validator_1.param)('type')
        .notEmpty()
        .withMessage('type is required')
        .isIn(['kid', 'parent'])
        .withMessage('type must be either "kid" or "parent"'),
];
exports.subCategoryCreateValidation = [
    (0, express_validator_1.body)('subCategoryName')
        .notEmpty()
        .withMessage('subCategoryName is required')
        .isString()
        .withMessage('subCategoryName must be a string'),
    (0, express_validator_1.body)('categoryId')
        .notEmpty()
        .withMessage('categoryId is required')
        .isMongoId()
        .withMessage('Invalid categoryId format'),
    (0, express_validator_1.body)('imageUrl')
        .notEmpty()
        .withMessage('imageUrl is required')
        .isString()
        .withMessage('imageUrl must be a string'),
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
exports.subCategoryUpdateValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid subCategory ID format'),
];
