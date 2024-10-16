"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCategoriesByCategoryIdUseCase = exports.getAllSubCategoryUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
//import { ICategoryBody } from '../../types/category/categoryModel';
const subCategoryRepo_1 = require("../repos/subCategoryRepo");
const getAllSubCategoryUseCase = async () => {
    const subCategoryRepo = new subCategoryRepo_1.SubCategoryRepo();
    const result = await subCategoryRepo.findAllSubCategories();
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getAllSubCategoryUseCase = getAllSubCategoryUseCase;
const getSubCategoriesByCategoryIdUseCase = async (categoryId) => {
    const subCategoryRepo = new subCategoryRepo_1.SubCategoryRepo();
    const result = await subCategoryRepo.findSubCategoriesByCategoryId(categoryId);
    if (!result || result.length === 0) {
        throw new appError_1.default('No sub categories found for the given category', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getSubCategoriesByCategoryIdUseCase = getSubCategoriesByCategoryIdUseCase;
