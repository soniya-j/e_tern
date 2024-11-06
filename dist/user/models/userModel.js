"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const usersSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    dob: { type: Date, required: true },
    userType: { type: String, enum: ['child', 'teenager', 'adult'], required: true },
    email: { type: String, required: true },
    parentName: { type: String },
    parentDob: { type: Date },
    avatar: { type: String, default: '' },
    otp: { type: String },
    interest: { type: String, default: '' },
    mobileNumberVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
}, { timestamps: true });
const usersModel = (0, mongoose_1.model)('Users', usersSchema);
exports.default = usersModel;
