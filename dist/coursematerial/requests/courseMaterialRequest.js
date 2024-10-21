"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseMaterialBySubCategoryIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getCourseMaterialBySubCategoryIdValidation = [
    (0, express_validator_1.param)('subCategoryId')
        .notEmpty()
        .withMessage('subCategoryId is required')
        .isMongoId()
        .withMessage('Invalid subCategoryId format'),
];
