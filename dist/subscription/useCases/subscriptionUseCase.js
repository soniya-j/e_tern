"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueDetailsUseCase = exports.getSubscriptionByIdUseCase = exports.getOfflinePaymentsUseCase = exports.offlinePaymentUseCase = exports.subscriptionUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const subscriptionRepo_1 = require("../repos/subscriptionRepo");
const studentRepo_1 = require("../../student/repos/studentRepo");
const packageRepo_1 = require("../../package/repos/packageRepo");
const packageCostRepo_1 = require("../../packagecost/repos/packageCostRepo");
const paymentgatewayRepo_1 = require("../../paymentgateway/repos/paymentgatewayRepo");
const imageUploader_1 = require("../../utils/imageUploader");
const subscriptionUseCase = async (data, userId) => {
    const studentExist = await (0, studentRepo_1.checkStudentIdExist)(data.studentId, userId);
    if (!studentExist)
        throw new appError_1.default('student Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    const exists = await (0, packageRepo_1.checkPackageExists)(data.packageId);
    if (!exists) {
        throw new appError_1.default('No packages found for the given packageId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const packageCostDetails = await (0, packageCostRepo_1.packageCostDetail)(data.packageId, data.packageCostId);
    if (!packageCostDetails) {
        throw new appError_1.default('No package cost found for the given packageCost ID', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionStartDate.getDate() + packageCostDetails.validity);
    const paymentgatewayRepo = new paymentgatewayRepo_1.PaymentgatewayRepo();
    const paymentgatewayDetail = await paymentgatewayRepo.findPaymentgatewayByName(data.paymentGateway);
    if (!paymentgatewayDetail) {
        throw new appError_1.default('This payment gateway not found', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    //Entry to payment collection
    const paymentData = {
        studentId: data.studentId,
        paymentGatewayId: paymentgatewayDetail._id,
        amount: packageCostDetails.price,
        paymentRef: data.paymentRef,
        comment: data.comment,
        paymentDate: subscriptionStartDate,
        status: data.status,
        deviceId: data.deviceId,
        userIP: data.userIP,
    };
    const paymentResult = await (0, subscriptionRepo_1.savePayment)(paymentData);
    if (!paymentResult) {
        throw new appError_1.default('something went wrong while saving payment', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    //Entry to subscription collection
    const subscriptionData = {
        studentId: data.studentId,
        packageId: data.packageId,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        paymentId: paymentResult._id,
        createdBy: userId,
    };
    const subscriptionResult = await (0, subscriptionRepo_1.subscribe)(subscriptionData);
    if (!subscriptionResult) {
        throw new appError_1.default('something went wrong while subscribing', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const studentData = {
        subscribed: true,
        packageId: data.packageId,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
    };
    await (0, studentRepo_1.updateStudentSubscription)(data.studentId, studentData);
    return { _id: subscriptionResult._id };
};
exports.subscriptionUseCase = subscriptionUseCase;
const offlinePaymentUseCase = async (data, userId, file) => {
    const studentExist = await (0, studentRepo_1.checkStudentExist)(data.studentId);
    if (!studentExist)
        throw new appError_1.default('student Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    const exists = await (0, packageRepo_1.checkPackageExists)(data.packageId);
    if (!exists) {
        throw new appError_1.default('No packages found for the given packageId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const packageCostDetails = await (0, packageCostRepo_1.packageCostDetail)(data.packageId, data.packageCostId);
    if (!packageCostDetails) {
        throw new appError_1.default('No package cost found for the given packageCost ID', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const subscriptionStartDate = new Date();
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionStartDate.getDate() + packageCostDetails.validity);
    const paymentgatewayRepo = new paymentgatewayRepo_1.PaymentgatewayRepo();
    const paymentgatewayDetail = await paymentgatewayRepo.findPaymentgatewayByName('offline');
    if (!paymentgatewayDetail) {
        throw new appError_1.default('This payment gateway not found', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    //Entry to payment collection
    const paymentData = {
        studentId: data.studentId,
        paymentGatewayId: paymentgatewayDetail._id,
        amount: data.amount,
        paymentRef: data.paymentRef,
        comment: data.comment,
        paymentDate: data.paymentDate,
        status: 'paid',
    };
    const paymentResult = await (0, subscriptionRepo_1.savePayment)(paymentData);
    if (!paymentResult) {
        throw new appError_1.default('something went wrong while saving payment', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    // Process the uploaded image
    if (file) {
        const uploadedFilePath = await (0, imageUploader_1.processAndUploadImage)(file, 'subscription');
        data.imageUrl = uploadedFilePath;
    }
    //Entry to subscription collection
    const subscriptionData = {
        studentId: data.studentId,
        packageId: data.packageId,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        paymentId: paymentResult._id,
        createdBy: userId,
        imageUrl: data.imageUrl,
    };
    const subscriptionResult = await (0, subscriptionRepo_1.subscribe)(subscriptionData);
    if (!subscriptionResult) {
        throw new appError_1.default('something went wrong while subscribing', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const studentData = {
        subscribed: true,
        packageId: data.packageId,
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
    };
    await (0, studentRepo_1.updateStudentSubscription)(data.studentId, studentData);
    return { _id: subscriptionResult._id };
};
exports.offlinePaymentUseCase = offlinePaymentUseCase;
const getOfflinePaymentsUseCase = async (filters, limit, page, mode) => {
    const result = await (0, subscriptionRepo_1.findAllOfflinePayments)(filters, limit, page, mode);
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getOfflinePaymentsUseCase = getOfflinePaymentsUseCase;
const getSubscriptionByIdUseCase = async (id) => {
    const result = await (0, subscriptionRepo_1.findSubscriptionById)(id);
    if (!result || result.length === 0) {
        throw new appError_1.default('No offline payment found for the given id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getSubscriptionByIdUseCase = getSubscriptionByIdUseCase;
const getRevenueDetailsUseCase = async () => {
    const currentMonthRevenue = await (0, subscriptionRepo_1.getCurrentMonthRevenue)();
    const growthPercentage = await (0, subscriptionRepo_1.getGrowthPercentage)();
    return {
        currentMonthRevenue,
        growthPercentage,
    };
};
exports.getRevenueDetailsUseCase = getRevenueDetailsUseCase;
