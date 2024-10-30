"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepo = void 0;
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
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
