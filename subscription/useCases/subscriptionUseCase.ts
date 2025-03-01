import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import {
  subscribe,
  findAllOfflinePayments,
  savePayment,
  findSubscriptionById,
  getGrowthPercentage,
  getCurrentMonthRevenue,
} from '../repos/subscriptionRepo';
import {
  ISubscription,
  ISubscriptionPaymentBody,
  IOfflinePaymentBody,
  ISubscriptionWithStudent,
  IRevenueDetails,
} from '../../types/subscription/subscriptionType';
import {
  checkStudentIdExist,
  updateStudentSubscription,
  checkStudentExist,
} from '../../student/repos/studentRepo';
import { checkPackageExists } from '../../package/repos/packageRepo';
import { packageCostDetail } from '../../packagecost/repos/packageCostRepo';
import { PaymentgatewayRepo } from '../../paymentgateway/repos/paymentgatewayRepo';
import { processAndUploadImage } from '../../utils/imageUploader';

export const subscriptionUseCase = async (
  data: ISubscriptionPaymentBody,
  userId: string,
): Promise<Pick<ISubscription, '_id'>> => {
  const studentExist = await checkStudentIdExist(data.studentId, userId);
  if (!studentExist) throw new AppError('student Not Found', HttpStatus.BAD_REQUEST);
  const exists = await checkPackageExists(data.packageId);
  if (!exists) {
    throw new AppError('No packages found for the given packageId', HttpStatus.NOT_FOUND);
  }

  const packageCostDetails = await packageCostDetail(data.packageId, data.packageCostId);
  if (!packageCostDetails) {
    throw new AppError('No package cost found for the given packageCost ID', HttpStatus.NOT_FOUND);
  }

  const subscriptionStartDate = new Date();
  const subscriptionEndDate = new Date();
  subscriptionEndDate.setDate(subscriptionStartDate.getDate() + packageCostDetails.validity);

  const paymentgatewayRepo = new PaymentgatewayRepo();
  const paymentgatewayDetail = await paymentgatewayRepo.findPaymentgatewayByName(
    data.paymentGateway,
  );

  if (!paymentgatewayDetail) {
    throw new AppError('This payment gateway not found', HttpStatus.NOT_FOUND);
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
  const paymentResult = await savePayment(paymentData);
  if (!paymentResult) {
    throw new AppError('something went wrong while saving payment', HttpStatus.NOT_FOUND);
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
  const subscriptionResult = await subscribe(subscriptionData);
  if (!subscriptionResult) {
    throw new AppError('something went wrong while subscribing', HttpStatus.NOT_FOUND);
  }

  const studentData = {
    subscribed: true,
    packageId: data.packageId,
    subscriptionStartDate: subscriptionStartDate,
    subscriptionEndDate: subscriptionEndDate,
  };
  await updateStudentSubscription(data.studentId, studentData);
  return { _id: subscriptionResult._id };
};

export const offlinePaymentUseCase = async (
  data: IOfflinePaymentBody,
  userId: string,
  file?: Express.Multer.File,
): Promise<Pick<ISubscription, '_id'>> => {
  const studentExist = await checkStudentExist(data.studentId);
  if (!studentExist) throw new AppError('student Not Found', HttpStatus.BAD_REQUEST);
  const exists = await checkPackageExists(data.packageId);
  if (!exists) {
    throw new AppError('No packages found for the given packageId', HttpStatus.NOT_FOUND);
  }

  const packageCostDetails = await packageCostDetail(data.packageId, data.packageCostId);
  if (!packageCostDetails) {
    throw new AppError('No package cost found for the given packageCost ID', HttpStatus.NOT_FOUND);
  }

  const subscriptionStartDate = new Date();
  const subscriptionEndDate = new Date();
  subscriptionEndDate.setDate(subscriptionStartDate.getDate() + packageCostDetails.validity);

  const paymentgatewayRepo = new PaymentgatewayRepo();
  const paymentgatewayDetail = await paymentgatewayRepo.findPaymentgatewayByName('offline');
  if (!paymentgatewayDetail) {
    throw new AppError('This payment gateway not found', HttpStatus.NOT_FOUND);
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
  const paymentResult = await savePayment(paymentData);
  if (!paymentResult) {
    throw new AppError('something went wrong while saving payment', HttpStatus.NOT_FOUND);
  }

  // Process the uploaded image
  if (file) {
    const uploadedFilePath = await processAndUploadImage(file, 'subscription');
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
  const subscriptionResult = await subscribe(subscriptionData);
  if (!subscriptionResult) {
    throw new AppError('something went wrong while subscribing', HttpStatus.NOT_FOUND);
  }

  const studentData = {
    subscribed: true,
    packageId: data.packageId,
    subscriptionStartDate: subscriptionStartDate,
    subscriptionEndDate: subscriptionEndDate,
  };
  await updateStudentSubscription(data.studentId, studentData);
  return { _id: subscriptionResult._id };
};

export const getOfflinePaymentsUseCase = async (
  filters: Partial<ISubscriptionWithStudent>,
  limit?: number,
  page?: number,
  mode?: string,
): Promise<{ data: ISubscriptionWithStudent[]; totalCount: number }> => {
  const result = await findAllOfflinePayments(filters, limit, page, mode);
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

export const getSubscriptionByIdUseCase = async (
  id: string,
): Promise<ISubscriptionWithStudent[]> => {
  const result = await findSubscriptionById(id);
  if (!result || result.length === 0) {
    throw new AppError('No offline payment found for the given id', HttpStatus.NOT_FOUND);
  }
  return result;
};

export const getRevenueDetailsUseCase = async (): Promise<IRevenueDetails> => {
  const currentMonthRevenue = await getCurrentMonthRevenue();
  const growthPercentage = await getGrowthPercentage();
  return {
    currentMonthRevenue,
    growthPercentage,
  };
};
