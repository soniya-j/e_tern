"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const packageSchema = new mongoose_1.Schema({
    packageName: { type: String, required: true },
    ageFrom: { type: Number, required: true },
    ageTo: { type: Number, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const packageModel = (0, mongoose_1.model)('package', packageSchema);
exports.default = packageModel;
