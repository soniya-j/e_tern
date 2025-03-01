"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubCategoriesByIdUseCase = exports.deleteSubCategoryUseCase = exports.updateSubCategoryUseCase = exports.createSubCategoryUseCase = exports.getSubCategoriesByCategoryIdUseCase = exports.getAllSubCategoryUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const subCategoryRepo_1 = require("../repos/subCategoryRepo");
const courseMaterialRepo_1 = require("../../coursematerial/repos/courseMaterialRepo");
const categoryRepo_1 = require("../../category/repos/categoryRepo");
const imageUploader_1 = require("../../utils/imageUploader");
const getAllSubCategoryUseCase = async (filters, limit, page) => {
    const subCategoryRepo = new subCategoryRepo_1.SubCategoryRepo();
    const result = await subCategoryRepo.findAllSubCategories(filters, limit, page);
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getAllSubCategoryUseCase = getAllSubCategoryUseCase;
/*
export const getSubCategoriesByCategoryIdUseCase = async (
  categoryId: string,
): Promise<ISubCategory[]> => {
  const subCategoryRepo = new SubCategoryRepo();
  const result = await subCategoryRepo.findSubCategoriesByCategoryId(categoryId);

  if (!result || result.length === 0) {
    throw new AppError('No sub categories found for the given category', HttpStatus.NOT_FOUND);
  }

  return result;
};
*/
const getSubCategoriesByCategoryIdUseCase = async (categoryId, type, userId) => {
    const subCategoryRepo = new subCategoryRepo_1.SubCategoryRepo();
    const subCategories = await subCategoryRepo.findSubCategoriesByCategoryId(categoryId, type);
    if (!subCategories || subCategories.length === 0) {
        throw new appError_1.default('No subcategories found for the given category', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    // If user is logged in, get tracking data
    if (userId) {
        const subCategoriesWithTracking = await Promise.all(subCategories.map(async (subCategory) => {
            const subCategoryId = subCategory._id.toString();
            const subCategoryPlain = 'toObject' in subCategory
                ? subCategory.toObject()
                : subCategory;
            const { totalMaterials, viewedMaterials, percentageViewed } = await (0, courseMaterialRepo_1.getCourseMaterialTrackBySubCategory)(userId, subCategoryId);
            return {
                ...subCategoryPlain,
                totalMaterials,
                viewedMaterials,
                percentageViewed: Math.round(percentageViewed),
            };
        }));
        return subCategoriesWithTracking;
    }
    return subCategories;
};
exports.getSubCategoriesByCategoryIdUseCase = getSubCategoriesByCategoryIdUseCase;
const createSubCategoryUseCase = async (data, file) => {
    const exists = await (0, categoryRepo_1.checkCategoryExists)(data.categoryId);
    if (!exists) {
        throw new appError_1.default('No categories found for the given categoryId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    // Process the uploaded image
    if (file) {
        const uploadedFilePath = await (0, imageUploader_1.processAndUploadImage)(file, 'subcategory');
        data.imageUrl = uploadedFilePath;
    }
    const result = await (0, subCategoryRepo_1.saveSubCategory)(data);
    return result;
};
exports.createSubCategoryUseCase = createSubCategoryUseCase;
const updateSubCategoryUseCase = async (id, data, file) => {
    const exists = await (0, categoryRepo_1.checkCategoryExists)(data.categoryId);
    if (!exists) {
        throw new appError_1.default('No categories found for the given categoryId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    // Process the uploaded image
    if (file) {
        const uploadedFilePath = await (0, imageUploader_1.processAndUploadImage)(file, 'subcategory');
        data.imageUrl = uploadedFilePath;
    }
    const result = await (0, subCategoryRepo_1.updateSubCategory)(id, data);
    return result;
};
exports.updateSubCategoryUseCase = updateSubCategoryUseCase;
const deleteSubCategoryUseCase = async (id) => {
    const checkSubCategoryIsChoosedRes = await (0, courseMaterialRepo_1.checkSubCategoryIsChoosed)(id);
    if (checkSubCategoryIsChoosedRes) {
        throw new appError_1.default('Deletion not allowed as this sub category is already in use.', httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    const deleteSubCategoryResult = await (0, subCategoryRepo_1.deleteSubCategory)(id);
    if (!deleteSubCategoryResult) {
        throw new appError_1.default('Failed to delete sub category', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
};
exports.deleteSubCategoryUseCase = deleteSubCategoryUseCase;
const getSubCategoriesByIdUseCase = async (id) => {
    const subCategoryRepo = new subCategoryRepo_1.SubCategoryRepo();
    const result = await subCategoryRepo.findSubCategoriesById(id);
    if (!result || result.length === 0) {
        throw new appError_1.default('No sub categories found for the given id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getSubCategoriesByIdUseCase = getSubCategoriesByIdUseCase;
