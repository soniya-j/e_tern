"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentsByUserIdUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const studentRepo_1 = require("../repos/studentRepo");
const getStudentsByUserIdUseCase = async (userId) => {
    const result = await (0, studentRepo_1.findStudentsByUserId)(userId);
    if (!result || result.length === 0) {
        throw new appError_1.default('No students found for the given user', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getStudentsByUserIdUseCase = getStudentsByUserIdUseCase;
