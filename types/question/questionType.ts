import { Document } from 'mongoose';

export interface IQuestion extends Document {
  questionText: string;
  isActive?: boolean;
  isDeleted?: boolean;
  type: string;
}

export interface IQuestionBody {
  questionText: string;
  sorting: number;
  type: string;
}
