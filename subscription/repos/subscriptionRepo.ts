import subscriptionModel from '../models/subscriptionModel';
import {
  ISubscriptionBody,
  ISubscriptionWithStudent,
} from '../../types/subscription/subscriptionType';
import paymentModel from '../models/paymentModel';
import { IPaymentBody } from '../../types/subscription/paymentType';
import { PaymentgatewayRepo } from '../../paymentgateway/repos/paymentgatewayRepo';

export const subscribe = async (data: ISubscriptionBody): Promise<{ _id: string }> => {
  const subscription = await subscriptionModel.create(data);
  return { _id: subscription._id as string };
};

export const savePayment = async (data: IPaymentBody): Promise<{ _id: string }> => {
  const result = await paymentModel.create(data);
  return { _id: result._id as string };
};

export const findAllOfflinePayments = async (
  filters: Partial<ISubscriptionWithStudent>,
  limit?: number,
  page?: number,
  mode?: string,
): Promise<{ data: ISubscriptionWithStudent[]; totalCount: number }> => {
  const query: any = { isDeleted: false };
  if (filters.studentName) {
    query.fullName = { $regex: filters.studentName, $options: 'i' };
  }
  const paymentgatewayRepo = new PaymentgatewayRepo();
  const paymentgatewayDetail = await paymentgatewayRepo.findPaymentgatewayByName('offline');

  if (!paymentgatewayDetail) {
    if (mode === 'offline') {
      throw new Error('Offline payment gateway not found');
    }
  }

  const paymentQuery: any = { isDeleted: false };
  if (mode === 'offline') {
    paymentQuery.paymentGatewayId = paymentgatewayDetail?._id ?? undefined; // Use optional chaining with fallback
  } else {
    paymentQuery.paymentGatewayId = { $ne: paymentgatewayDetail?._id ?? undefined };
  }

  const paymentIds = (await paymentModel.find(paymentQuery).select('_id').lean()).map(
    (payment) => payment._id,
  );
  query.paymentId = { $in: paymentIds };

  // Fetch subscriptions with filtered payments
  if (limit !== undefined && page !== undefined) {
    const skip = (page - 1) * limit;
    const data = await subscriptionModel
      .find(query)
      .populate('packageId', 'packageName packageId')
      .populate('paymentId', 'amount paymentDate paymentGatewayId')
      .populate('studentId', 'fullName studentId')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean();
    const totalCount = await subscriptionModel.countDocuments(query);
    return { data, totalCount };
  }

  return await subscriptionModel
    .find(query)
    .populate('packageId', 'packageName packageId')
    .populate('paymentId', 'amount paymentDate paymentGatewayId')
    .populate('studentId', 'fullName studentId')
    .sort({ createdAt: -1 })
    .lean();
};

export const findSubscriptionById = async (
  id: string,
): Promise<ISubscriptionWithStudent[] | null> => {
  return await subscriptionModel
    .find({ _id: id, isDeleted: false })
    .populate('packageId', 'packageName packageId')
    .populate(
      'paymentId',
      'amount paymentDate paymentGatewayId comment paymentRef status paymentGatewayId',
    )
    .populate('studentId', 'fullName studentId')
    .sort({ createdAt: -1 })
    .lean();
};

export const getCurrentMonthRevenue = async (): Promise<number> => {
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const result = await paymentModel.aggregate([
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

export const getGrowthPercentage = async (): Promise<number> => {
  const currentMonthRevenue = await getCurrentMonthRevenue();
  // Get the previous month's start and end dates
  const now = new Date();
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  const result = await paymentModel.aggregate([
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
  if (lastMonthRevenue === 0) return currentMonthRevenue > 0 ? 100 : 0;

  const growthPercentage = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
  return parseFloat(growthPercentage.toFixed(2));
};
