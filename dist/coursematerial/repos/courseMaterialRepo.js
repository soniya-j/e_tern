"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseMaterialRepo = void 0;
const courseMaterialModel_1 = __importDefault(require("../models/courseMaterialModel"));
class CourseMaterialRepo {
    async findAllSubCategories() {
        return await courseMaterialModel_1.default
            .find({ isActive: true, isDeleted: false })
            .sort({ sorting: 1 });
    }
    async findSubCategoriesByCategoryId(subCategoryId) {
        return await courseMaterialModel_1.default
            .find({ subCategoryId, isActive: true, isDeleted: false })
            .sort({ sorting: 1 });
    }
}
exports.CourseMaterialRepo = CourseMaterialRepo;
