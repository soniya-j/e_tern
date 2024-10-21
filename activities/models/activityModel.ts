import { Schema, model } from 'mongoose';
import { IActivityModel } from '../../types/user/activityTypes';

const activitySchema = new Schema<IActivityModel>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: String, required: true },
    userType: { type: String, enum: ['child', 'teenager', 'adult'], required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const activityModel = model<IActivityModel>('activity', activitySchema);
export default activityModel;
