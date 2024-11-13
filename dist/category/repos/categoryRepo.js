"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.checkCategoryExists = exports.saveCategory = exports.CategoryRepo = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
class CategoryRepo {
    async findAllCategories() {
        return await categoryModel_1.default.find({ isActive: true, isDeleted: false }).sort({ sorting: 1 });
    }
    async findCategoriesByPackageId(packageId, type) {
        return await categoryModel_1.default
            .find({ packageId, type, isActive: true, isDeleted: false })
            .sort({ sorting: 1 })
            .lean();
    }
}
exports.CategoryRepo = CategoryRepo;
const saveCategory = async (data) => {
    const result = await categoryModel_1.default.create(data);
    return { _id: result._id };
};
exports.saveCategory = saveCategory;
const checkCategoryExists = async (id) => {
    const result = await categoryModel_1.default.findById(id);
    return !!result;
};
exports.checkCategoryExists = checkCategoryExists;
const updateCategory = async (id, data) => {
    const updatedRes = await categoryModel_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updatedRes) {
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { _id: updatedRes._id };
};
exports.updateCategory = updateCategory;
