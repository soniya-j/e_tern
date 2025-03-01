"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategoryUseCase = exports.updateCategoryUseCase = exports.createCategoryUseCase = exports.getCategoriesByPackageIdUseCase = exports.getCategoriesByIdUseCase = exports.getAllCategoryUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const categoryRepo_1 = require("../repos/categoryRepo");
const courseMaterialRepo_1 = require("../../coursematerial/repos/courseMaterialRepo");
const objectIdParser_1 = require("../../utils/objectIdParser");
const studentRepo_1 = require("../../student/repos/studentRepo");
const packageRepo_1 = require("../../package/repos/packageRepo");
const subCategoryRepo_1 = require("../../subcategory/repos/subCategoryRepo");
const imageUploader_1 = require("../../utils/imageUploader");
const getAllCategoryUseCase = async (filters, limit, page) => {
    const categoryRepo = new categoryRepo_1.CategoryRepo();
    const result = await categoryRepo.findAllCategories(filters, limit, page);
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getAllCategoryUseCase = getAllCategoryUseCase;
const getCategoriesByIdUseCase = async (id) => {
    const categoryRepo = new categoryRepo_1.CategoryRepo();
    const result = await categoryRepo.findCategoriesById(id);
    if (!result || result.length === 0) {
        throw new appError_1.default('No categories found for the given id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getCategoriesByIdUseCase = getCategoriesByIdUseCase;
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
/*
export const createCategoryUseCase = async (
  data: ICategoryBody,
): Promise<Pick<ICategory, '_id'>> => {
  const exists = await checkPackageExists(data.packageId);
  if (!exists) {
    throw new AppError('No packages found for the given packageId', HttpStatus.NOT_FOUND);
  }
  const result = await saveCategory(data);
  return result;
};
*/
const createCategoryUseCase = async (data, file) => {
    const exists = await (0, packageRepo_1.checkPackageExists)(data.packageId);
    if (!exists) {
        throw new appError_1.default('No packages found for the given packageId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    // Process the uploaded image
    if (file) {
        const uploadedFilePath = await (0, imageUploader_1.processAndUploadImage)(file, 'category');
        data.imageUrl = uploadedFilePath;
    }
    const result = await (0, categoryRepo_1.saveCategory)(data);
    return result;
};
exports.createCategoryUseCase = createCategoryUseCase;
const updateCategoryUseCase = async (id, data, file) => {
    const exists = await (0, packageRepo_1.checkPackageExists)(data.packageId);
    if (!exists) {
        throw new appError_1.default('No packages found for the given packageId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    // Process the uploaded image
    if (file) {
        const uploadedFilePath = await (0, imageUploader_1.processAndUploadImage)(file, 'category');
        data.imageUrl = uploadedFilePath;
    }
    const result = await (0, categoryRepo_1.updateCategory)(id, data);
    return result;
};
exports.updateCategoryUseCase = updateCategoryUseCase;
const deleteCategoryUseCase = async (id) => {
    const checkCategoryIsChoosedRes = await (0, subCategoryRepo_1.checkCategoryIsChoosed)(id);
    if (checkCategoryIsChoosedRes) {
        throw new appError_1.default('Deletion not allowed as this category is already in use.', httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    const deleteCategoryResult = await (0, categoryRepo_1.deleteCategory)(id);
    if (!deleteCategoryResult) {
        throw new appError_1.default('Failed to delete category', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
};
exports.deleteCategoryUseCase = deleteCategoryUseCase;
