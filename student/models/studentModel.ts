import { Schema, model } from 'mongoose';
import { IStudent } from '../../types/student/studentType';

const studentSchema = new Schema<IStudent>(
  {
    fullName: { type: String, required: true },
    dob: { type: Date, required: true },
    avatar: { type: String, default: '' },
    gender: { type: String, default: '' },
    userId: { type: String, required: true, ref: 'Users' },
    packageId: { type: String, default: '' },
    subscriptionStartDate: { type: Date },
    subscriptionEndDate: { type: Date },
    subscribed: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const studentModel = model<IStudent>('Student', studentSchema);
export default studentModel;
