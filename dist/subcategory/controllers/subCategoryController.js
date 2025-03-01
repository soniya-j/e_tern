"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCategoriesById = exports.getSubCategoriesByCategoryIdAdmin = exports.deleteSubCategory = exports.updateSubCategory = exports.createSubCategory = exports.getSubCategoriesByCategoryId = exports.getSubCategories = void 0;
const subCategoryUseCase_1 = require("../useCases/subCategoryUseCase");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const localization_1 = require("../../config/localization");
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const express_validator_1 = require("express-validator");
exports.getSubCategories = (0, express_async_handler_1.default)(async (req, res) => {
    const filters = {
        subCategoryName: req.query.subCategoryName,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
    };
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const result = await (0, subCategoryUseCase_1.getAllSubCategoryUseCase)(filters, limit, page);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
const getSubCategoriesByCategoryId = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    try {
        const { categoryId } = req.params;
        const { type } = req.params;
        const userId = res.locals.userId; // get userId from locals ( using JWT middleware )
        const result = await (0, subCategoryUseCase_1.getSubCategoriesByCategoryIdUseCase)(categoryId, type, userId);
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
            message: localization_1.responseMessages.unexpected_error,
        });
    }
};
exports.getSubCategoriesByCategoryId = getSubCategoriesByCategoryId;
exports.createSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const file = req.file;
    const data = req.body;
    const result = await (0, subCategoryUseCase_1.createSubCategoryUseCase)(data, file || undefined);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_post,
        result: result,
    });
});
exports.updateSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
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
    const file = req.file;
    const result = await (0, subCategoryUseCase_1.updateSubCategoryUseCase)(id, data, file || undefined);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_put,
        result: result,
    });
});
exports.deleteSubCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const id = req.params.id;
    const result = await (0, subCategoryUseCase_1.deleteSubCategoryUseCase)(id);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_delete,
        result: result,
    });
});
const getSubCategoriesByCategoryIdAdmin = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    try {
        const { categoryId } = req.params;
        const { type } = req.params;
        const result = await (0, subCategoryUseCase_1.getSubCategoriesByCategoryIdUseCase)(categoryId, type);
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
            message: localization_1.responseMessages.unexpected_error,
        });
    }
};
exports.getSubCategoriesByCategoryIdAdmin = getSubCategoriesByCategoryIdAdmin;
exports.getSubCategoriesById = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const id = req.params.id;
    const result = await (0, subCategoryUseCase_1.getSubCategoriesByIdUseCase)(id);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
