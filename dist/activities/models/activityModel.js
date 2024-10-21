"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const activitySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: String, required: true },
    userType: { type: String, enum: ['child', 'teenager', 'adult'], required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const activityModel = (0, mongoose_1.model)('activity', activitySchema);
exports.default = activityModel;
