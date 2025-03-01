"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.checkCategoryExists = exports.saveCategory = exports.CategoryRepo = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const objectIdParser_1 = require("../../utils/objectIdParser");
class CategoryRepo {
    async findAllCategories(filters, limit, page) {
        const query = {};
        if (filters.categoryName) {
            query.categoryName = { $regex: filters.categoryName, $options: 'i' };
        }
        if (filters.type) {
            query.type = { $regex: filters.type, $options: 'i' };
        }
        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        query.isDeleted = false;
        if (limit !== undefined && page !== undefined) {
            const skip = (page - 1) * limit;
            const data = await categoryModel_1.default
                .find(query)
                .populate('packageId', 'packageName packageId')
                .limit(limit)
                .skip(skip)
                .sort({ createdAt: -1 })
                .lean();
            const totalCount = await categoryModel_1.default.countDocuments(query);
            return {
                data,
                totalCount,
            };
        }
        query.isActive = true;
        return await categoryModel_1.default
            .find(query)
            .populate('packageId', 'packageName packageId')
            .sort({ createdAt: -1 })
            .lean();
    }
    async findCategoriesByPackageId(packageId, type) {
        return await categoryModel_1.default
            .find({ packageId, type, isActive: true, isDeleted: false })
            .sort({ sorting: 1 })
            .lean();
    }
    async findCategoriesById(id) {
        return await categoryModel_1.default
            .findOne({ _id: id, isDeleted: false })
            .populate({
            path: 'packageId',
            select: 'packageName',
        })
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
const deleteCategory = async (id) => {
    const result = await categoryModel_1.default.findOneAndUpdate({ _id: (0, objectIdParser_1.ObjectID)(id) }, { isDeleted: true, modifiedOn: new Date().toISOString() }, { new: true });
    if (!result) {
        throw new appError_1.default('No document found with the Id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.deleteCategory = deleteCategory;
