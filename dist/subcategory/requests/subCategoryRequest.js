"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCategoryByCategoryIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getSubCategoryByCategoryIdValidation = [
    (0, express_validator_1.param)('categoryId')
        .notEmpty()
        .withMessage('categoryId is required')
        .isMongoId()
        .withMessage('Invalid categoryId format'),
];
