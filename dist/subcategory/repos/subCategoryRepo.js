"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubCategory = exports.checkSubCategoryExists = exports.saveSubCategory = exports.SubCategoryRepo = void 0;
const subCategoryModel_1 = __importDefault(require("../models/subCategoryModel"));
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
class SubCategoryRepo {
    async findAllSubCategories() {
        return await subCategoryModel_1.default.find({ isActive: true, isDeleted: false }).sort({ sorting: 1 });
    }
    async findSubCategoriesByCategoryId(categoryId, type) {
        return await subCategoryModel_1.default
            .find({ categoryId, type, isActive: true, isDeleted: false })
            .sort({ sorting: 1 })
            .lean();
    }
}
exports.SubCategoryRepo = SubCategoryRepo;
const saveSubCategory = async (data) => {
    const result = await subCategoryModel_1.default.create(data);
    return { _id: result._id };
};
exports.saveSubCategory = saveSubCategory;
const checkSubCategoryExists = async (id) => {
    const result = await subCategoryModel_1.default.findById(id);
    return !!result;
};
exports.checkSubCategoryExists = checkSubCategoryExists;
const updateSubCategory = async (id, data) => {
    const updatedRes = await subCategoryModel_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updatedRes) {
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { _id: updatedRes._id };
};
exports.updateSubCategory = updateSubCategory;
