"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentSubscriptions = exports.exportStudent = exports.getStudentByIdAdmin = exports.getStudents = exports.updateStudent = exports.addStudent = exports.getStudentsByUserId = void 0;
const studentUseCase_1 = require("../useCases/studentUseCase");
const localization_1 = require("../../config/localization");
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const express_validator_1 = require("express-validator");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const exceljs_1 = __importDefault(require("exceljs"));
const getStudentsByUserId = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    try {
        const userId = res.locals.userId;
        const result = await (0, studentUseCase_1.getStudentsByUserIdUseCase)(userId);
        return res.status(200).json({
            success: true,
            message: localization_1.responseMessages.response_success_get,
            result: result,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: localization_1.responseMessages.unexpected_error,
        });
    }
};
exports.getStudentsByUserId = getStudentsByUserId;
exports.addStudent = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const data = req.body;
    const result = await (0, studentUseCase_1.addStudentUseCase)(data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_post,
        result: result,
    });
});
exports.updateStudent = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const { studentId } = req.params;
    const data = req.body;
    const result = await (0, studentUseCase_1.updateStudentUseCase)(studentId, data);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_put,
        result: result,
    });
});
const getStudents = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
    }
    try {
        const filters = {
            fullName: req.query.fullName,
            subscribed: req.query.subscribed === 'true'
                ? true
                : req.query.subscribed === 'false'
                    ? false
                    : undefined,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        };
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const result = await (0, studentUseCase_1.getStudentsUseCase)(filters, limit, page);
        return res.status(200).json({
            success: true,
            message: 'Fetch users successfully',
            result,
        });
    }
    catch (error) {
        if (error instanceof appError_1.default) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            });
        }
        return res.status(500).json({
            success: false,
            message: 'An error occurred',
        });
    }
};
exports.getStudents = getStudents;
exports.getStudentByIdAdmin = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const id = req.params.id;
    const result = await (0, studentUseCase_1.getStudentByIdAdminUseCase)(id);
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
const exportStudent = async (req, res) => {
    try {
        const filters = {
            fullName: req.query.fullName,
            subscribed: req.query.subscribed === 'true'
                ? true
                : req.query.subscribed === 'false'
                    ? false
                    : undefined,
            isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        };
        const usersData = await (0, studentUseCase_1.getStudentsUseCase)(filters, 100000, 1);
        if (!usersData || usersData.data.length === 0) {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({
                success: false,
                message: 'No users found for export',
            });
        }
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet('Users List');
        // Define columns
        worksheet.columns = [
            { header: 'Full Name', key: 'fullName', width: 20 },
            { header: 'Mobile Number', key: 'mobileNumber', width: 15 },
            { header: 'Email', key: 'email', width: 20 },
            { header: 'Date of Birth', key: 'dob', width: 15 },
            { header: 'Parent Name', key: 'parentName', width: 20 },
            { header: 'Subscription', key: 'subscription', width: 15 },
            { header: 'Status', key: 'status', width: 10 },
        ];
        // Add rows
        usersData.data.forEach((user) => {
            const userDetails = typeof user.userId === 'object' ? user.userId : {};
            worksheet.addRow({
                fullName: user.fullName,
                mobileNumber: userDetails.mobileNumber || 'N/A',
                email: userDetails.email || 'N/A',
                dob: user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A',
                parentName: userDetails.parentName || 'N/A',
                subscription: user.subscribed ? 'Subscribed' : 'Free user',
                status: user.isActive ? 'Active' : 'Inactive',
            });
        });
        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        // Write to response stream
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (error) {
        console.error('Error exporting users:', error);
        return res.status(500).json({
            success: false,
            message: 'Error exporting users',
        });
    }
};
exports.exportStudent = exportStudent;
exports.studentSubscriptions = (0, express_async_handler_1.default)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
            success: false,
            errors: errors.array(),
        });
        return;
    }
    const result = await (0, studentUseCase_1.getStudentSubscriptionsUseCase)();
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
