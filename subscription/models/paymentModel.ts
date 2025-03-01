import { Schema, model } from 'mongoose';
import { IPayment } from '../../types/subscription/paymentType';

const paymentSchema = new Schema<IPayment>(
  {
    studentId: { type: String, required: true },
    paymentGatewayId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentRef: { type: String, required: true },
    comment: { type: String, default: '' },
    paymentDate: { type: Date, required: true },
    status: { type: String, required: true },
    deviceId: { type: String },
    userIP: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const paymentModel = model<IPayment>('payment', paymentSchema);
export default paymentModel;
