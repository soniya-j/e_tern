"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userAuthSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    deviceType: { type: String, required: true },
    authToken: { type: String },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
const userAuthModel = (0, mongoose_1.model)('UserAuth', userAuthSchema);
exports.default = userAuthModel;
