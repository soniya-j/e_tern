"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryUseCase = exports.createCategoryUseCase = exports.getCategoriesByPackageIdUseCase = exports.getAllCategoryUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const categoryRepo_1 = require("../repos/categoryRepo");
const courseMaterialRepo_1 = require("../../coursematerial/repos/courseMaterialRepo");
const objectIdParser_1 = require("../../utils/objectIdParser");
const studentRepo_1 = require("../../student/repos/studentRepo");
const packageRepo_1 = require("../../package/repos/packageRepo");
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
        throw new appError_1.default('No categories found for the given studentId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const categories = await categoryRepo.findCategoriesByPackageId(packageId, type);
    if (!categories || categories.length === 0) {
        throw new appError_1.default('No categories found for the given studentId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    if (userId) {
        const categoriesWithTracking = await Promise.all(categories.map(async (category) => {
            const categoryId = (0, objectIdParser_1.objectIdToString)(category._id);
            const categoryPlain = 'toObject' in category
                ? category.toObject()
                : category;
            const { totalMaterials, viewedMaterials, percentageViewed } = await (0, courseMaterialRepo_1.getCourseMaterialTrackByCategory)(studentId, categoryId);
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
const createCategoryUseCase = async (data) => {
    const exists = await (0, packageRepo_1.checkPackageExists)(data.packageId);
    if (!exists) {
        throw new appError_1.default('No packages found for the given packageId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const result = await (0, categoryRepo_1.saveCategory)(data);
    return result;
};
exports.createCategoryUseCase = createCategoryUseCase;
const updateCategoryUseCase = async (id, data) => {
    const exists = await (0, packageRepo_1.checkPackageExists)(data.packageId);
    if (!exists) {
        throw new appError_1.default('No packages found for the given packageId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const result = await (0, categoryRepo_1.updateCategory)(id, data);
    return result;
};
exports.updateCategoryUseCase = updateCategoryUseCase;
