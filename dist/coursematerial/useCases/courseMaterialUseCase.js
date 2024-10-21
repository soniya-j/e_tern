"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseMaterialBySubCategoryIdUseCase = exports.getAllCourseMaterialUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
//import { ICategoryBody } from '../../types/category/categoryModel';
const courseMaterialRepo_1 = require("../repos/courseMaterialRepo");
const getAllCourseMaterialUseCase = async () => {
    const courseMaterialRepo = new courseMaterialRepo_1.CourseMaterialRepo();
    const result = await courseMaterialRepo.findAllSubCategories();
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getAllCourseMaterialUseCase = getAllCourseMaterialUseCase;
const getCourseMaterialBySubCategoryIdUseCase = async (categoryId) => {
    const courseMaterialRepo = new courseMaterialRepo_1.CourseMaterialRepo();
    const result = await courseMaterialRepo.findSubCategoriesByCategoryId(categoryId);
    if (!result || result.length === 0) {
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getCourseMaterialBySubCategoryIdUseCase = getCourseMaterialBySubCategoryIdUseCase;
