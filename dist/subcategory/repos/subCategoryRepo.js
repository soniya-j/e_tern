"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubCategory = exports.checkCategoryIsChoosed = exports.updateSubCategory = exports.checkSubCategoryExists = exports.saveSubCategory = exports.SubCategoryRepo = void 0;
const subCategoryModel_1 = __importDefault(require("../models/subCategoryModel"));
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const objectIdParser_1 = require("../../utils/objectIdParser");
class SubCategoryRepo {
    async findAllSubCategories(filters, limit, page) {
        const query = {};
        if (filters.subCategoryName) {
            query.subCategoryName = { $regex: filters.subCategoryName, $options: 'i' };
        }
        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        query.isDeleted = false;
        const skip = (page - 1) * limit;
        const data = await subCategoryModel_1.default
            .find(query)
            .populate({
            path: 'categoryId',
            match: { isDeleted: false },
            select: 'categoryName categoryId',
            populate: {
                path: 'packageId',
                match: { isDeleted: false },
                select: 'packageName',
            },
        })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 })
            .lean();
        const totalCount = await subCategoryModel_1.default.countDocuments(query);
        return {
            data,
            totalCount,
        };
    }
    async findSubCategoriesByCategoryId(categoryId, type) {
        return await subCategoryModel_1.default
            .find({ categoryId, type, isActive: true, isDeleted: false })
            .sort({ sorting: 1 })
            .lean();
    }
    async findSubCategoriesById(id) {
        return await subCategoryModel_1.default
            .findOne({ _id: id, isDeleted: false })
            .populate({
            path: 'categoryId',
            select: 'categoryName',
        })
            .lean();
    }
    async findSubCategories() {
        return await subCategoryModel_1.default
            .find({ isActive: true, isDeleted: false })
            .populate({
            path: 'categoryId',
            match: { isDeleted: false },
            select: 'categoryName categoryId',
        })
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
const checkCategoryIsChoosed = async (categoryId) => {
    return await subCategoryModel_1.default.findOne({ categoryId, isDeleted: false }).select({ _id: 1 }).lean();
};
exports.checkCategoryIsChoosed = checkCategoryIsChoosed;
const deleteSubCategory = async (id) => {
    const result = await subCategoryModel_1.default.findOneAndUpdate({ _id: (0, objectIdParser_1.ObjectID)(id) }, { isDeleted: true, modifiedOn: new Date().toISOString() }, { new: true });
    if (!result) {
        throw new appError_1.default('No document found with the Id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.deleteSubCategory = deleteSubCategory;
