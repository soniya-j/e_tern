"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseMaterialViewSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true },
    courseMaterialId: { type: String, required: true },
    viewedPercentage: { type: Number },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const courseMaterialViewModel = (0, mongoose_1.model)('courseMaterialView', courseMaterialViewSchema);
exports.default = courseMaterialViewModel;
