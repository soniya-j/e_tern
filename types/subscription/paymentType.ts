import { Document } from 'mongoose';

export interface IPayment extends Document {
  paymentGatewayId: string;
  studentId: string;
  amount: number;
  paymentRef: string;
  comment: string;
  status: string;
  deviceId: string;
  userIP: string;
  paymentDate: Date;
  isDeleted?: boolean;
}

export interface IPaymentBody {
  paymentGatewayId: string;
  studentId: string;
  amount: number;
  paymentRef: string;
  comment: string;
  status: string;
  deviceId?: string;
  userIP?: string;
  paymentDate: Date;
}
