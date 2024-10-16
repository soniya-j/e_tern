"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageCostsByPackageId = exports.getPackageCosts = void 0;
const packageCostUseCase_1 = require("../useCases/packageCostUseCase");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const localization_1 = require("../../config/localization");
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
//import { ICategoryBody } from '../../types/category/categoryModel';
exports.getPackageCosts = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, packageCostUseCase_1.getAllPackageCostsUseCase)();
    res.status(201).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
const getPackageCostsByPackageId = async (req, res) => {
    try {
        const { packageId } = req.params;
        const result = await (0, packageCostUseCase_1.getPackageCostsByPackageIdUseCase)(packageId);
        return res.status(200).json({
            success: true,
            message: localization_1.responseMessages.response_success_get,
            result: result,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'An unexpected error occurred',
        });
    }
};
exports.getPackageCostsByPackageId = getPackageCostsByPackageId;
