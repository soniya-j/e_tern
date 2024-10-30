"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPackage = exports.findStudentExists = void 0;
const studentModel_1 = __importDefault(require("../models/studentModel"));
const packageModel_1 = __importDefault(require("../../package/models/packageModel"));
const mongoose_1 = require("mongoose");
const findStudentExists = async (studentId, userId) => {
    return await studentModel_1.default
        .findOne({ _id: studentId, userId, isDeleted: false })
        .select({ _id: 1 })
        .lean();
};
exports.findStudentExists = findStudentExists;
const findPackage = async (studentId) => {
    try {
        const student = await studentModel_1.default
            .findOne({ _id: new mongoose_1.Types.ObjectId(studentId), isDeleted: false })
            .select({ packageId: 1, dob: 1 })
            .lean();
        if (!student)
            return null;
        const birthDate = new Date(student.dob);
        const currentDate = new Date();
        let age = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
            age--;
        }
        if (student.packageId) {
            return { packageId: student.packageId };
        }
        const matchingPackage = await packageModel_1.default
            .findOne({
            ageFrom: { $lte: age },
            ageTo: { $gte: age },
            isDeleted: false,
            isActive: true,
        })
            .select({ _id: 1 })
            .lean();
        return matchingPackage ? { packageId: matchingPackage._id.toString() } : null;
    }
    catch (error) {
        console.error('Error in findPackage:', error);
        throw error;
    }
};
exports.findPackage = findPackage;
