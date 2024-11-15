import { Schema, model } from 'mongoose';
import { ICourseMaterialWatchHistoryBody } from '../../types/coursematerial/courseMaterialModel';

const courseMaterialWatchHistorySchema = new Schema<ICourseMaterialWatchHistoryBody>(
  {
    studentId: { type: String, required: true },
    categoryId: { type: String, required: true },
    subCategoryId: { type: String, required: true },
    courseMaterialId: { type: String, required: true },
    watchedDuration: { type: Number },    
  },
  { timestamps: true },
);

const courseMaterialWatchHistoryModel = model<ICourseMaterialWatchHistoryBody>(
  'coursematerialwatchhistory',
  courseMaterialWatchHistorySchema,
);
export default courseMaterialWatchHistoryModel;
