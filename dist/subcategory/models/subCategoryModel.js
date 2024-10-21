"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subCategorySchema = new mongoose_1.Schema({
    subCategoryName: { type: String, required: true },
    categoryId: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    sorting: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const subCategoryModel = (0, mongoose_1.model)('subcategory', subCategorySchema);
exports.default = subCategoryModel;
