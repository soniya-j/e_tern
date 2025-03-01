"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackagesById = exports.deletePackage = exports.updatePackage = exports.createPackage = exports.getAllPackagesAdmin = exports.getAllPackages = void 0;
const packageUseCase_1 = require("../useCases/packageUseCase");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const localization_1 = require("../../config/localization");
const httpStatus_1 = require("../../common/httpStatus");
const express_validator_1 = require("express-validator");
exports.getAllPackages = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, packageUseCase_1.getAllPackagesUseCase)();
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
exports.getAllPackagesAdmin = (0, express_async_handler_1.default)(async (req, res) => {
    const filters = {
        packageName: req.query.packageName,
        type: req.query.type,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
    };
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const page = limit ? parseInt(req.query.page) || 1 : 0;
    const result = await (0, packageUseCase_1.getAllPackagesAdminUseCase)(filters, limit, page);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
exports.createPackage = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    //  const data = req.body as IPackageBody;
    const data = req.body;
    const result = await (0, packageUseCase_1.createPackageUseCase)(data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_post,
        result: result,
    });
});
exports.updatePackage = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const id = req.params.id;
    const data = req.body;
    const result = await (0, packageUseCase_1.updatePackageUseCase)(id, data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_put,
        result: result,
    });
});
exports.deletePackage = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const id = req.params.id;
    const result = await (0, packageUseCase_1.deletePackageUseCase)(id);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_delete,
        result: result,
    });
});
exports.getPackagesById = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const id = req.params.id;
    const result = await (0, packageUseCase_1.getPackagesByIdUseCase)(id);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
