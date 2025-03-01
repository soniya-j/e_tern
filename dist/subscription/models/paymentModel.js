"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true },
    paymentGatewayId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentRef: { type: String, required: true },
    comment: { type: String, default: '' },
    paymentDate: { type: Date, required: true },
    status: { type: String, required: true },
    deviceId: { type: String },
    userIP: { type: String },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const paymentModel = (0, mongoose_1.model)('payment', paymentSchema);
exports.default = paymentModel;
