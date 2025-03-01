import { Schema, model } from 'mongoose';
import { ISubscription } from '../../types/subscription/subscriptionType';

const subscriptionSchema = new Schema<ISubscription>(
  {
    studentId: { type: String, required: true, ref: 'Student' },
    packageId: { type: String, required: true, ref: 'package' },
    paymentId: { type: String, required: true, ref: 'payment' },
    createdBy: { type: String, required: true, ref: 'user' },
    subscriptionStartDate: { type: Date, required: true },
    subscriptionEndDate: { type: Date, required: true },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const subscriptionModel = model<ISubscription>('subscription', subscriptionSchema);
export default subscriptionModel;
