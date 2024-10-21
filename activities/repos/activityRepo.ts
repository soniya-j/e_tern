import { IActivityResponse } from '../../types/user/activityTypes';
import activityModel from '../models/activityModel';

export const fetchAllActivities = async (): Promise<IActivityResponse[]> => {
  return await activityModel
    .find({ isDeleted: false })
    .select({ _id: 1, title: 1, shortDescription: 1, category: 1 })
    .lean();
};
