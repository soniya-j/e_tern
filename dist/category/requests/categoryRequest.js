"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoryByPackageIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getCategoryByPackageIdValidation = [
    (0, express_validator_1.param)('packageId')
        .notEmpty()
        .withMessage('packageId is required')
        .isMongoId()
        .withMessage('Invalid packageId format'),
];
