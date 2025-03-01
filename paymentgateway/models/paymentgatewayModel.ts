import { Schema, model } from 'mongoose';
import { IPaymentgateway } from '../../types/paymentgateway/paymentgatewayType';

const paymentgatewaySchema = new Schema<IPaymentgateway>(
  {
    paymentGatewayName: { type: String, required: true },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const paymentgatewayModel = model<IPaymentgateway>('paymentgateway', paymentgatewaySchema);
export default paymentgatewayModel;
