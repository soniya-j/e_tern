import { Schema, model } from 'mongoose';
import { ITrackCourseMaterialView } from '../../types/coursematerial/courseMaterialModel';

const courseMaterialViewSchema = new Schema<ITrackCourseMaterialView>(
  {
    userId: { type: String, required: true },
    courseMaterialId: { type: String, required: true },
    viewedPercentage: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const courseMaterialViewModel = model<ITrackCourseMaterialView>(
  'courseMaterialView',
  courseMaterialViewSchema,
);
export default courseMaterialViewModel;
