import studentModel from '../models/studentModel';
import packageModel from '../../package/models/packageModel';
import { Types } from 'mongoose';
import { IStudent, IStudentBody, IStudentSubscription } from '../../types/student/studentType';
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
  const _id = ObjectID(id);
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

export const packageIsSubscribed = async (packageId: string): Promise<{ _id: string } | null> => {
  return await studentModel.findOne({ packageId, isDeleted: false }).select({ _id: 1 }).lean();
};

export const updateStudentSubscription = async (
  id: string,
  data: IStudentSubscription,
): Promise<IStudentBody> => {
  const _id = ObjectID(id);
  const obj = { modifiedOn: new Date().toISOString(), ...data };
  const updatedData = await studentModel.findOneAndUpdate({ _id }, obj, { new: true }).lean();
  if (!updatedData) {
    throw new AppError('Something went wrong', HttpStatus.BAD_REQUEST);
  }
  return updatedData;
};

export const getAllStudents = async (
  filters: Partial<IStudent>,
  limit: number,
  page: number,
): Promise<{ data: IStudent[]; totalCount: number }> => {
  const query: any = {};
  if (filters.fullName) {
    query.fullName = { $regex: filters.fullName, $options: 'i' };
  }
  if (filters.subscribed !== undefined) {
    query.subscribed = filters.subscribed;
  }
  if (filters.isActive !== undefined) {
    query.isActive = filters.isActive;
  }
  query.isDeleted = false;
  const skip = (page - 1) * limit;
  const data: IStudent[] =
    (await studentModel
      .find(query)
      .populate('userId', 'mobileNumber email parentName')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean()) || [];
  const totalCount: number = await studentModel.countDocuments(query);

  return {
    data,
    totalCount,
  };
};

export const getSubscribedStudentCount = async (): Promise<number> => {
  const currentDate = new Date();
  try {
    const result = await studentModel.countDocuments({
      isDeleted: false,
      subscribed: true,
      subscriptionStartDate: { $lte: currentDate },
      subscriptionEndDate: { $gte: currentDate },
    });
    return result;
  } catch (error) {
    throw new Error('Failed to fetch student count');
  }
};

export const getStudentCount = async (): Promise<number> => {
  try {
    const result = await studentModel.countDocuments({
      isDeleted: false,
    });
    return result;
  } catch (error) {
    throw new Error('Failed to fetch student count');
  }
};

export const getCurrentMonthActivities = async (): Promise<{
  registeredThisMonth: number;
  subscribedThisMonth: number;
  freeUsersThisMonth: number;
}> => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Count students registered this month
    const registeredThisMonth = await studentModel.countDocuments({
      isDeleted: false,
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    // Count students subscribed this month
    const subscribedThisMonth = await studentModel.countDocuments({
      isDeleted: false,
      subscribed: true,
      subscriptionStartDate: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    const freeUsersThisMonth = registeredThisMonth - subscribedThisMonth;
    return { registeredThisMonth, subscribedThisMonth, freeUsersThisMonth };
  } catch (error) {
    throw new Error('Failed to fetch student counts');
  }
};

export const findStudentsById = async (id: string): Promise<IStudent[] | null> => {
  return await studentModel
    .findOne({ _id: id, isDeleted: false })
    .populate({
      path: 'userId',
      select: 'fullName mobileNumber email',
    })
    .lean();
};

export const checkStudentExist = async (studentId: string): Promise<{ _id: string } | null> => {
  const _id = ObjectID(studentId);
  return await studentModel.findOne({ _id, isDeleted: false }).select({ _id: 1 }).lean();
};

export const getStudentSubscriptions = async (): Promise<{ subscription_date: string; total_subscriptions: number }[]> => {
  try {
    const formatDate = (date: Date): string => {
      const day = date.getDate();
      const suffix =
        day === 1 || day === 21 || day === 31 ? 'st' :
        day === 2 || day === 22 ? 'nd' :
        day === 3 || day === 23 ? 'rd' : 'th';
      return `${day}${suffix}`;
    };

    // Generate last 10 days
    const last10Days: { subscription_date: string; total_subscriptions: number }[] = Array.from({ length: 10 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 9 + i); 
      return { subscription_date: formatDate(date), total_subscriptions: 0 };
    });

    const result: { _id: string; total_subscriptions: number }[] = await studentModel.aggregate([
      {
        $match: {
          subscriptionStartDate: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 10)), // Last 10 days
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$subscriptionStartDate' } },
          total_subscriptions: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, 
      },
    ]);

    // Convert database result into a lookup object
    const subscriptionData: Record<string, number> = result.reduce((acc, item) => {
      const date = new Date(item._id);
      acc[formatDate(date)] = item.total_subscriptions;
      return acc;
    }, {} as Record<string, number>);

    // Merge database result with last 10 days data
    return last10Days.map((day) => ({
      subscription_date: day.subscription_date,
      total_subscriptions: subscriptionData[day.subscription_date] || 0,
    }));
  } catch (error) {
    console.error('Error fetching student subscriptions:', error);
    throw new Error('Database query failed');
  }
};
