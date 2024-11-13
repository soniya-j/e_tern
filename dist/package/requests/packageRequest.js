"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageUpdateValidation = exports.packageCreateValidation = void 0;
const express_validator_1 = require("express-validator");
exports.packageCreateValidation = [
    (0, express_validator_1.body)('packageName')
        .notEmpty()
        .withMessage('packageName is required')
        .isString()
        .withMessage('packageName must be a string'),
    (0, express_validator_1.body)('ageFrom')
        .notEmpty()
        .withMessage('ageFrom is required')
        .isNumeric()
        .withMessage('ageFrom must be a number'),
    (0, express_validator_1.body)('ageTo')
        .notEmpty()
        .withMessage('ageTo is required')
        .isNumeric()
        .withMessage('ageTo must be a number'),
];
exports.packageUpdateValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid package ID format'),
];
