"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const usersSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    mobileNumber: { type: Number, required: true },
    dob: { type: String, required: true },
    userType: { type: String, enum: ['child', 'teenager', 'adult'], required: true },
    email: { type: String },
    parentName: { type: String },
    parentDob: { type: String },
    avatar: { type: String, default: '' },
    otp: { type: String },
    interest: { type: String, default: '' },
    mobileNumberVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
}, { timestamps: true });
const usersModel = (0, mongoose_1.model)('Users', usersSchema);
exports.default = usersModel;
