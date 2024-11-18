"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseMaterialWatchHistorySchema = new mongoose_1.Schema({
    studentId: { type: String, required: true },
    categoryId: { type: String, required: true },
    subCategoryId: { type: String, required: true },
    courseMaterialId: { type: String, required: true },
    watchedDuration: { type: Number },
}, { timestamps: true });
const courseMaterialWatchHistoryModel = (0, mongoose_1.model)('coursematerialwatchhistory', courseMaterialWatchHistorySchema);
exports.default = courseMaterialWatchHistoryModel;
