import studentModel from '../models/studentModel';
import packageModel from '../../package/models/packageModel';
import { Types } from 'mongoose';
import { IStudent, IStudentBody } from '../../types/student/studentType';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { ObjectID } from '../../utils/objectIdParser';

export const findStudentExists = async (
  studentId: string,
  userId: string,
): Promise<{ _id: string } | null> => {
  return await studentModel
    .findOne({ _id: studentId, userId, isDeleted: false })
    .select({ _id: 1 })
    .lean();
};

export const findPackage = async (
  studentId: string,
): Promise<{ packageId: string | null } | null> => {
  try {
    const student = await studentModel
      .findOne({ _id: new Types.ObjectId(studentId), isDeleted: false })
      .select({ packageId: 1, dob: 1, subscriptionEndDate: 1, subscribed: 1 })
      .lean();
    if (!student) return null;

    const birthDate = new Date(student.dob);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }

    if (
      student.packageId &&
      student.subscribed &&
      student.subscriptionEndDate &&
      student.subscriptionEndDate > new Date()
    ) {
      return { packageId: student.packageId };
    }
    const matchingPackage = await packageModel
      .findOne({
        ageFrom: { $lte: age },
        ageTo: { $gte: age },
        isDeleted: false,
        isActive: true,
      })
      .select({ _id: 1 })
      .lean();

    return matchingPackage ? { packageId: matchingPackage._id.toString() } : null;
  } catch (error) {
    console.error('Error in findPackage:', error);
    throw error;
  }
};

export const findStudentsByUserId = async (userId: string): Promise<IStudent[] | null> => {
  return await studentModel.find({ userId, isDeleted: false }).sort({ _id: 1 }).lean();
};

export const createStudent = async (data: IStudentBody): Promise<{ _id: string }> => {
  const student = await studentModel.create(data);
  return { _id: student._id as string };
};

export const updateStudent = async (id: string, data: IStudentBody): Promise<IStudentBody> => {
  const _id = new Types.ObjectId(id);
  const obj = { modifiedOn: new Date().toISOString(), ...data };
  const updatedData = await studentModel.findOneAndUpdate({ _id }, obj, { new: true }).lean();
  if (!updatedData) {
    throw new AppError('Something went wrong', HttpStatus.BAD_REQUEST);
  }
  return updatedData;
};

export const checkStudentIdExist = async (
  studentId: string,
  userId: string,
): Promise<{ _id: string } | null> => {
  const _id = ObjectID(studentId);
  return await studentModel.findOne({ _id, userId, isDeleted: false }).select({ _id: 1 }).lean();
};

export const getStudentById = async (studentId: string): Promise<IStudent | null> => {
  const _id = ObjectID(studentId);
  return await studentModel.findOne({ _id, isDeleted: false }).lean();
};
