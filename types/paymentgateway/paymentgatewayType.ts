import { Document } from 'mongoose';

export interface IPaymentgateway extends Document {
  paymentGatewayName: string;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface IPaymentgatewayBody {
  paymentGatewayName: string;
  description?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}
