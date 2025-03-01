"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true, ref: 'Student' },
    packageId: { type: String, required: true, ref: 'package' },
    paymentId: { type: String, required: true, ref: 'payment' },
    createdBy: { type: String, required: true, ref: 'user' },
    subscriptionStartDate: { type: Date, required: true },
    subscriptionEndDate: { type: Date, required: true },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const subscriptionModel = (0, mongoose_1.model)('subscription', subscriptionSchema);
exports.default = subscriptionModel;
