"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueDetails = exports.getSubscriptionById = exports.getOfflinePayments = exports.addOfflinePayment = exports.subscription = void 0;
const subscriptionUseCase_1 = require("../useCases/subscriptionUseCase");
const localization_1 = require("../../config/localization");
const httpStatus_1 = require("../../common/httpStatus");
const express_validator_1 = require("express-validator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.subscription = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const data = req.body;
    const userId = res.locals.userId;
    const result = await (0, subscriptionUseCase_1.subscriptionUseCase)(data, userId);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.subscription_success,
        result: result,
    });
});
exports.addOfflinePayment = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const data = req.body;
    const userId = res.locals.userId;
    const file = req.file;
    const result = await (0, subscriptionUseCase_1.offlinePaymentUseCase)(data, userId, file || undefined);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.subscription_success,
        result: result,
    });
});
exports.getOfflinePayments = (0, express_async_handler_1.default)(async (req, res) => {
    const filters = {
        studentName: req.query.studentName,
    };
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const page = limit ? parseInt(req.query.page) || 1 : 0;
    const mode = typeof req.query.mode === 'string' ? req.query.mode : undefined;
    const result = await (0, subscriptionUseCase_1.getOfflinePaymentsUseCase)(filters, limit, page, mode);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
exports.getSubscriptionById = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const id = req.params.id;
    const result = await (0, subscriptionUseCase_1.getSubscriptionByIdUseCase)(id);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
exports.getRevenueDetails = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const result = await (0, subscriptionUseCase_1.getRevenueDetailsUseCase)();
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
