import { IActivityResponse } from '../../types/user/activityTypes';
import { fetchAllActivities } from '../repos/activityRepo';

export const getAllActivitiesUseCase = async (): Promise<IActivityResponse[]> => {
  return await fetchAllActivities();
};
