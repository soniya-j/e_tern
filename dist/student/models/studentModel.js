"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const studentSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    avatar: { type: String, default: '' },
    gender: { type: String, default: '' },
    userId: { type: String, required: true, ref: 'Users' },
    packageId: { type: String, default: '' },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    subscribed: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
const studentModel = (0, mongoose_1.model)('Student', studentSchema);
exports.default = studentModel;
