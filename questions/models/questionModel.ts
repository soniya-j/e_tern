import { Schema, model } from 'mongoose';
import { IQuestion } from '../../types/question/questionType';

const questionSchema = new Schema<IQuestion>(
  {
    questionText: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const questionModel = model<IQuestion>('Question', questionSchema);
export default questionModel;
