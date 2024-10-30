"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryByPackageIdValidation = void 0;
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
