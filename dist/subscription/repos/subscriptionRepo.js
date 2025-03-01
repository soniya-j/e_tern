"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGrowthPercentage = exports.getCurrentMonthRevenue = exports.findSubscriptionById = exports.findAllOfflinePayments = exports.savePayment = exports.subscribe = void 0;
const subscriptionModel_1 = __importDefault(require("../models/subscriptionModel"));
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const paymentgatewayRepo_1 = require("../../paymentgateway/repos/paymentgatewayRepo");
const subscribe = async (data) => {
    const subscription = await subscriptionModel_1.default.create(data);
    return { _id: subscription._id };
};
exports.subscribe = subscribe;
const savePayment = async (data) => {
    const result = await paymentModel_1.default.create(data);
    return { _id: result._id };
};
exports.savePayment = savePayment;
const findAllOfflinePayments = async (filters, limit, page, mode) => {
    const query = { isDeleted: false };
    if (filters.studentName) {
        query.fullName = { $regex: filters.studentName, $options: 'i' };
    }
    const paymentgatewayRepo = new paymentgatewayRepo_1.PaymentgatewayRepo();
    const paymentgatewayDetail = await paymentgatewayRepo.findPaymentgatewayByName('offline');
    if (!paymentgatewayDetail) {
        if (mode === 'offline') {
            throw new Error('Offline payment gateway not found');
        }
    }
    const paymentQuery = { isDeleted: false };
    if (mode === 'offline') {
        paymentQuery.paymentGatewayId = paymentgatewayDetail?._id ?? undefined; // Use optional chaining with fallback
    }
    else {
        paymentQuery.paymentGatewayId = { $ne: paymentgatewayDetail?._id ?? undefined };
    }
    const paymentIds = (await paymentModel_1.default.find(paymentQuery).select('_id').lean()).map((payment) => payment._id);
    query.paymentId = { $in: paymentIds };
    // Fetch subscriptions with filtered payments
    if (limit !== undefined && page !== undefined) {
        const skip = (page - 1) * limit;
        const data = await subscriptionModel_1.default
            .find(query)
            .populate('packageId', 'packageName packageId')
            .populate('paymentId', 'amount paymentDate paymentGatewayId')
            .populate('studentId', 'fullName studentId')
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 })
            .lean();
        const totalCount = await subscriptionModel_1.default.countDocuments(query);
        return { data, totalCount };
    }
    return await subscriptionModel_1.default
        .find(query)
        .populate('packageId', 'packageName packageId')
        .populate('paymentId', 'amount paymentDate paymentGatewayId')
        .populate('studentId', 'fullName studentId')
        .sort({ createdAt: -1 })
        .lean();
};
exports.findAllOfflinePayments = findAllOfflinePayments;
const findSubscriptionById = async (id) => {
    return await subscriptionModel_1.default
        .find({ _id: id, isDeleted: false })
        .populate('packageId', 'packageName packageId')
        .populate('paymentId', 'amount paymentDate paymentGatewayId comment paymentRef status paymentGatewayId')
        .populate('studentId', 'fullName studentId')
        .sort({ createdAt: -1 })
        .lean();
};
exports.findSubscriptionById = findSubscriptionById;
const getCurrentMonthRevenue = async () => {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const result = await paymentModel_1.default.aggregate([
        {
            $match: {
                isDeleted: false,
                status: 'paid',
                paymentDate: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' },
            },
        },
    ]);
    return result.length > 0 ? result[0].totalRevenue : 0;
};
exports.getCurrentMonthRevenue = getCurrentMonthRevenue;
const getGrowthPercentage = async () => {
    const currentMonthRevenue = await (0, exports.getCurrentMonthRevenue)();
    // Get the previous month's start and end dates
    const now = new Date();
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const result = await paymentModel_1.default.aggregate([
        {
            $match: {
                isDeleted: false,
                status: 'paid',
                paymentDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$amount' },
            },
        },
    ]);
    const lastMonthRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    if (lastMonthRevenue === 0)
        return currentMonthRevenue > 0 ? 100 : 0;
    const growthPercentage = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    return parseFloat(growthPercentage.toFixed(2));
};
exports.getGrowthPercentage = getGrowthPercentage;
