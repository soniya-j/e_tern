import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { findStudentsByUserId } from '../repos/studentRepo';
import { IStudent } from '../../types/student/studentType';

export const getStudentsByUserIdUseCase = async (userId: string): Promise<IStudent[]> => {
  const result = await findStudentsByUserId(userId);
  if (!result || result.length === 0) {
    throw new AppError('No students found for the given user', HttpStatus.NOT_FOUND);
  }
  return result;
};
