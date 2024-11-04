import studentModel from '../models/studentModel';
import packageModel from '../../package/models/packageModel';
import { Types } from 'mongoose';
import { IStudent } from '../../types/student/studentType';

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
  return await studentModel.findOne({ userId, isDeleted: false }).sort({ _id: 1 }).lean();
};
