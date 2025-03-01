"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionIdValidation = exports.offlinePaymentValidation = exports.subscriptionValidation = void 0;
const express_validator_1 = require("express-validator");
exports.subscriptionValidation = [
    (0, express_validator_1.body)('studentId')
        .notEmpty()
        .withMessage('studentId is required')
        .isMongoId()
        .withMessage('Invalid studentId format'),
    (0, express_validator_1.body)('packageId')
        .notEmpty()
        .withMessage('packageId is required')
        .isMongoId()
        .withMessage('Invalid packageId format'),
    (0, express_validator_1.body)('packageCostId')
        .notEmpty()
        .withMessage('packageCostId is required')
        .isMongoId()
        .withMessage('Invalid packageCostId format'),
    (0, express_validator_1.body)('paymentRef')
        .notEmpty()
        .withMessage('paymentRef is required')
        .isString()
        .withMessage('paymentRef must be a string'),
    (0, express_validator_1.body)('paymentGateway')
        .notEmpty()
        .withMessage('paymentGateway is required')
        .isString()
        .withMessage('paymentGateway must be a string'),
    (0, express_validator_1.body)('comment').isString().withMessage('comment must be a string'),
    (0, express_validator_1.body)('status')
        .notEmpty()
        .withMessage('status is required')
        .isString()
        .withMessage('status must be a string'),
    (0, express_validator_1.body)('deviceId')
        .notEmpty()
        .withMessage('deviceId is required')
        .isString()
        .withMessage('deviceId must be a string'),
    (0, express_validator_1.body)('userIP')
        .notEmpty()
        .withMessage('userIP is required')
        .isString()
        .withMessage('userIP must be a string'),
];
exports.offlinePaymentValidation = [
    (0, express_validator_1.body)('studentId')
        .notEmpty()
        .withMessage('studentId is required')
        .isMongoId()
        .withMessage('Invalid studentId format'),
    (0, express_validator_1.body)('packageId')
        .notEmpty()
        .withMessage('packageId is required')
        .isMongoId()
        .withMessage('Invalid packageId format'),
    (0, express_validator_1.body)('packageCostId')
        .notEmpty()
        .withMessage('packageCostId is required')
        .isMongoId()
        .withMessage('Invalid packageCostId format'),
    (0, express_validator_1.body)('paymentRef')
        .notEmpty()
        .withMessage('paymentRef is required')
        .isString()
        .withMessage('paymentRef must be a string'),
    /*
    body('paymentDate')
      .notEmpty()
      .withMessage('paymentDate is required')
      .isDate()
      .withMessage('paymentDate must be a date'),
    */
    (0, express_validator_1.body)('paymentDate')
        .notEmpty()
        .withMessage('paymentDate is required')
        .custom((value) => {
        return !isNaN(Date.parse(value));
    })
        .withMessage('paymentDate must be a valid date'),
    (0, express_validator_1.body)('comment').isString().withMessage('comment must be a string'),
    (0, express_validator_1.body)('amount')
        .notEmpty()
        .withMessage('amount is required')
        .isNumeric()
        .withMessage('amount must be a number'),
];
exports.subscriptionIdValidation = [
    (0, express_validator_1.param)('id').notEmpty().isMongoId().withMessage('Invalid ID format'),
];
