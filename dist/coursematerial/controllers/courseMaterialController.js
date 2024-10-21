"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseMaterialsBySubCategoryId = exports.getCourseMaterials = void 0;
const courseMaterialUseCase_1 = require("../useCases/courseMaterialUseCase");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const localization_1 = require("../../config/localization");
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const express_validator_1 = require("express-validator");
exports.getCourseMaterials = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, courseMaterialUseCase_1.getAllCourseMaterialUseCase)();
    res.status(201).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
const getCourseMaterialsBySubCategoryId = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
    }
    try {
        const { subCategoryId } = req.params;
        const result = await (0, courseMaterialUseCase_1.getCourseMaterialBySubCategoryIdUseCase)(subCategoryId);
        return res.status(200).json({
            success: true,
            message: localization_1.responseMessages.response_success_get,
            result: result,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            // Custom application error
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        // Unexpected errors (could log the error for debugging)
        return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'An unexpected error occurred',
        });
    }
};
exports.getCourseMaterialsBySubCategoryId = getCourseMaterialsBySubCategoryId;