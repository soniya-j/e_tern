"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentSubscriptionsUseCase = exports.getStudentByIdAdminUseCase = exports.getStudentsUseCase = exports.updateStudentUseCase = exports.addStudentUseCase = exports.getStudentsByUserIdUseCase = void 0;
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
const addStudentUseCase = async (data) => {
    const result = await (0, studentRepo_1.createStudent)(data);
    return result;
};
exports.addStudentUseCase = addStudentUseCase;
const updateStudentUseCase = async (studentId, data) => {
    const result = await (0, studentRepo_1.updateStudent)(studentId, data);
    return result;
};
exports.updateStudentUseCase = updateStudentUseCase;
const getStudentsUseCase = async (filters, limit, page) => {
    const result = await (0, studentRepo_1.getAllStudents)(filters, limit, page);
    if (!result.data || result.data.length === 0) {
        throw new appError_1.default('No Users found', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getStudentsUseCase = getStudentsUseCase;
const getStudentByIdAdminUseCase = async (id) => {
    const result = await (0, studentRepo_1.findStudentsById)(id);
    if (!result || result.length === 0) {
        throw new appError_1.default('No students found for the given id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getStudentByIdAdminUseCase = getStudentByIdAdminUseCase;
const getStudentSubscriptionsUseCase = async () => {
    const result = await (0, studentRepo_1.getStudentSubscriptions)();
    if (!result || result.length === 0) {
        throw new appError_1.default('No chart data found', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getStudentSubscriptionsUseCase = getStudentSubscriptionsUseCase;
