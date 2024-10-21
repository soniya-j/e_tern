"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseMaterialSchema = new mongoose_1.Schema({
    courseMaterialName: { type: String, required: true },
    subCategoryId: { type: String, required: true },
    courseMaterialUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    sorting: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const courseMaterialModel = (0, mongoose_1.model)('coursematerial', courseMaterialSchema);
exports.default = courseMaterialModel;
