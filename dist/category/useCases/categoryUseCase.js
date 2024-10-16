"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategoriesByPackageIdUseCase = exports.getAllCategoryUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
//import { ICategoryBody } from '../../types/category/categoryModel';
const categoryRepo_1 = require("../repos/categoryRepo");
const getAllCategoryUseCase = async () => {
    const categoryRepo = new categoryRepo_1.CategoryRepo();
    const result = await categoryRepo.findAllCategories();
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getAllCategoryUseCase = getAllCategoryUseCase;
const getCategoriesByPackageIdUseCase = async (packageId) => {
    const categoryRepo = new categoryRepo_1.CategoryRepo();
    const result = await categoryRepo.findCategoriesByPackageId(packageId);
    if (!result || result.length === 0) {
        throw new appError_1.default('No categories found for the given package', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getCategoriesByPackageIdUseCase = getCategoriesByPackageIdUseCase;
