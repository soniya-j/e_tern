"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentgatewaySchema = new mongoose_1.Schema({
    paymentGatewayName: { type: String, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const paymentgatewayModel = (0, mongoose_1.model)('paymentgateway', paymentgatewaySchema);
exports.default = paymentgatewayModel;
