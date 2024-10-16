"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const packageCostSchema = new mongoose_1.Schema({
    packageId: { type: String, required: true },
    price: { type: Number, required: true },
    from: { type: Date, default: '' },
    to: { type: Date, default: '' },
    validity: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const packageCostModel = (0, mongoose_1.model)('packagecost', packageCostSchema);
exports.default = packageCostModel;
