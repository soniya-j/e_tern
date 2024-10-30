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
const courseMaterialRepo_1 = require("../../coursematerial/repos/courseMaterialRepo");
const objectIdParser_1 = require("../../utils/objectIdParser");
const studentRepo_1 = require("../../student/repos/studentRepo");
const getAllCategoryUseCase = async () => {
    const categoryRepo = new categoryRepo_1.CategoryRepo();
    const result = await categoryRepo.findAllCategories();
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getAllCategoryUseCase = getAllCategoryUseCase;
/*
export const getCategoriesByPackageIdUseCase = async (
  packageId: string,
  type: string,
): Promise<ICategory[]> => {
  const categoryRepo = new CategoryRepo();
  const result = await categoryRepo.findCategoriesByPackageId(packageId, type);
  if (!result || result.length === 0) {
    throw new AppError('No categories found for the given package', HttpStatus.NOT_FOUND);
  }
  return result;
};
*/
const getCategoriesByPackageIdUseCase = async (studentId, type, userId) => {
    const categoryRepo = new categoryRepo_1.CategoryRepo();
    const studentExists = await (0, studentRepo_1.findStudentExists)(studentId, userId);
    if (!studentExists) {
        throw new appError_1.default('No profile found for the given studentId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const packageResult = await (0, studentRepo_1.findPackage)(studentId);
    const packageId = packageResult?.packageId;
    if (!packageId) {
        throw new appError_1.default('No categories found for the given package', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const categories = await categoryRepo.findCategoriesByPackageId(packageId, type);
    if (!categories || categories.length === 0) {
        throw new appError_1.default('No categories found for the given package', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    if (userId) {
        const categoriesWithTracking = await Promise.all(categories.map(async (category) => {
            //   const categoryId = category._id.toString();
            const categoryId = (0, objectIdParser_1.objectIdToString)(category._id);
            const categoryPlain = 'toObject' in category
                ? category.toObject()
                : category;
            const { totalMaterials, viewedMaterials, percentageViewed } = await (0, courseMaterialRepo_1.getCourseMaterialTrackByCategory)(userId, categoryId);
            return {
                ...categoryPlain,
                totalMaterials,
                viewedMaterials,
                percentageViewed: Math.round(percentageViewed),
            };
        }));
        return categoriesWithTracking;
    }
    return categories;
};
exports.getCategoriesByPackageIdUseCase = getCategoriesByPackageIdUseCase;
