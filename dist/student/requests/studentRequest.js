"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentsByUserIdValidation = void 0;
const express_validator_1 = require("express-validator");
exports.getStudentsByUserIdValidation = [
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .withMessage('userId is required')
        .isMongoId()
        .withMessage('Invalid userId format'),
];
