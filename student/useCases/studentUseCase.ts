import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { createStudent, findStudentsByUserId, updateStudent } from '../repos/studentRepo';
import { IStudent, IStudentBody } from '../../types/student/studentType';

export const getStudentsByUserIdUseCase = async (userId: string): Promise<IStudent[]> => {
  const result = await findStudentsByUserId(userId);
  if (!result || result.length === 0) {
    throw new AppError('No students found for the given user', HttpStatus.NOT_FOUND);
  }
  return result;
};

export const addStudentUseCase = async (data: IStudentBody): Promise<Pick<IStudent, '_id'>> => {
  const result = await createStudent(data);
  return result;
};

export const updateStudentUseCase = async (
  studentId: string,
  data: IStudentBody,
): Promise<IStudentBody> => {
  const result = await updateStudent(studentId, data);
  return result;
};
