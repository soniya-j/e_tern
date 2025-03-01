import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import {
  createStudent,
  findStudentsByUserId,
  updateStudent,
  getAllStudents,
  findStudentsById,
  getStudentSubscriptions,
} from '../repos/studentRepo';
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

export const getStudentsUseCase = async (
  filters: Partial<IStudent>,
  limit: number,
  page: number,
): Promise<{ data: IStudent[]; totalCount: number }> => {
  const result = await getAllStudents(filters, limit, page);
  if (!result.data || result.data.length === 0) {
    throw new AppError('No Users found', HttpStatus.NOT_FOUND);
  }
  return result;
};

export const getStudentByIdAdminUseCase = async (id: string): Promise<IStudent[]> => {
  const result = await findStudentsById(id);
  if (!result || result.length === 0) {
    throw new AppError('No students found for the given id', HttpStatus.NOT_FOUND);
  }
  return result;
};

export const getStudentSubscriptionsUseCase = async () => {
  const result = await getStudentSubscriptions();
  if (!result || result.length === 0) {
    throw new AppError('No chart data found', HttpStatus.NOT_FOUND);
  }
  return result;
};
