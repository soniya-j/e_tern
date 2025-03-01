"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentSubscriptions = exports.checkStudentExist = exports.findStudentsById = exports.getCurrentMonthActivities = exports.getStudentCount = exports.getSubscribedStudentCount = exports.getAllStudents = exports.updateStudentSubscription = exports.packageIsSubscribed = exports.getStudentById = exports.checkStudentIdExist = exports.updateStudent = exports.createStudent = exports.findStudentsByUserId = exports.findPackage = exports.findStudentExists = void 0;
const studentModel_1 = __importDefault(require("../models/studentModel"));
const packageModel_1 = __importDefault(require("../../package/models/packageModel"));
const mongoose_1 = require("mongoose");
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const objectIdParser_1 = require("../../utils/objectIdParser");
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
            .select({ packageId: 1, dob: 1, subscriptionEndDate: 1, subscribed: 1 })
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
        if (student.packageId &&
            student.subscribed &&
            student.subscriptionEndDate &&
            student.subscriptionEndDate > new Date()) {
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
const findStudentsByUserId = async (userId) => {
    return await studentModel_1.default.find({ userId, isDeleted: false }).sort({ _id: 1 }).lean();
};
exports.findStudentsByUserId = findStudentsByUserId;
const createStudent = async (data) => {
    const student = await studentModel_1.default.create(data);
    return { _id: student._id };
};
exports.createStudent = createStudent;
const updateStudent = async (id, data) => {
    const _id = (0, objectIdParser_1.ObjectID)(id);
    const obj = { modifiedOn: new Date().toISOString(), ...data };
    const updatedData = await studentModel_1.default.findOneAndUpdate({ _id }, obj, { new: true }).lean();
    if (!updatedData) {
        throw new appError_1.default('Something went wrong', httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    return updatedData;
};
exports.updateStudent = updateStudent;
const checkStudentIdExist = async (studentId, userId) => {
    const _id = (0, objectIdParser_1.ObjectID)(studentId);
    return await studentModel_1.default.findOne({ _id, userId, isDeleted: false }).select({ _id: 1 }).lean();
};
exports.checkStudentIdExist = checkStudentIdExist;
const getStudentById = async (studentId) => {
    const _id = (0, objectIdParser_1.ObjectID)(studentId);
    return await studentModel_1.default.findOne({ _id, isDeleted: false }).lean();
};
exports.getStudentById = getStudentById;
const packageIsSubscribed = async (packageId) => {
    return await studentModel_1.default.findOne({ packageId, isDeleted: false }).select({ _id: 1 }).lean();
};
exports.packageIsSubscribed = packageIsSubscribed;
const updateStudentSubscription = async (id, data) => {
    const _id = (0, objectIdParser_1.ObjectID)(id);
    const obj = { modifiedOn: new Date().toISOString(), ...data };
    const updatedData = await studentModel_1.default.findOneAndUpdate({ _id }, obj, { new: true }).lean();
    if (!updatedData) {
        throw new appError_1.default('Something went wrong', httpStatus_1.HttpStatus.BAD_REQUEST);
    }
    return updatedData;
};
exports.updateStudentSubscription = updateStudentSubscription;
const getAllStudents = async (filters, limit, page) => {
    const query = {};
    if (filters.fullName) {
        query.fullName = { $regex: filters.fullName, $options: 'i' };
    }
    if (filters.subscribed !== undefined) {
        query.subscribed = filters.subscribed;
    }
    if (filters.isActive !== undefined) {
        query.isActive = filters.isActive;
    }
    query.isDeleted = false;
    const skip = (page - 1) * limit;
    const data = (await studentModel_1.default
        .find(query)
        .populate('userId', 'mobileNumber email parentName')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 })
        .lean()) || [];
    const totalCount = await studentModel_1.default.countDocuments(query);
    return {
        data,
        totalCount,
    };
};
exports.getAllStudents = getAllStudents;
const getSubscribedStudentCount = async () => {
    const currentDate = new Date();
    try {
        const result = await studentModel_1.default.countDocuments({
            isDeleted: false,
            subscribed: true,
            subscriptionStartDate: { $lte: currentDate },
            subscriptionEndDate: { $gte: currentDate },
        });
        return result;
    }
    catch (error) {
        throw new Error('Failed to fetch student count');
    }
};
exports.getSubscribedStudentCount = getSubscribedStudentCount;
const getStudentCount = async () => {
    try {
        const result = await studentModel_1.default.countDocuments({
            isDeleted: false,
        });
        return result;
    }
    catch (error) {
        throw new Error('Failed to fetch student count');
    }
};
exports.getStudentCount = getStudentCount;
const getCurrentMonthActivities = async () => {
    try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
        // Count students registered this month
        const registeredThisMonth = await studentModel_1.default.countDocuments({
            isDeleted: false,
            createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        });
        // Count students subscribed this month
        const subscribedThisMonth = await studentModel_1.default.countDocuments({
            isDeleted: false,
            subscribed: true,
            subscriptionStartDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
        });
        const freeUsersThisMonth = registeredThisMonth - subscribedThisMonth;
        return { registeredThisMonth, subscribedThisMonth, freeUsersThisMonth };
    }
    catch (error) {
        throw new Error('Failed to fetch student counts');
    }
};
exports.getCurrentMonthActivities = getCurrentMonthActivities;
const findStudentsById = async (id) => {
    return await studentModel_1.default
        .findOne({ _id: id, isDeleted: false })
        .populate({
        path: 'userId',
        select: 'fullName mobileNumber email',
    })
        .lean();
};
exports.findStudentsById = findStudentsById;
const checkStudentExist = async (studentId) => {
    const _id = (0, objectIdParser_1.ObjectID)(studentId);
    return await studentModel_1.default.findOne({ _id, isDeleted: false }).select({ _id: 1 }).lean();
};
exports.checkStudentExist = checkStudentExist;
const getStudentSubscriptions = async () => {
    try {
        const result = await studentModel_1.default.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 9)) }, // Last 10 days
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    total_subscriptions: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 }, // Sorting in ascending order by date
            },
        ]);
        return result.map((item) => ({
            subscription_date: item._id,
            total_subscriptions: item.total_subscriptions,
        }));
    }
    catch (error) {
        console.error('Error fetching student subscriptions:', error);
        throw new Error('Database query failed');
    }
};
exports.getStudentSubscriptions = getStudentSubscriptions;
