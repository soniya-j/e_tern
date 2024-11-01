import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import {
  CourseMaterialRepo,
  checkUserCourseIdExist,
  trackCourseMaterial,
  checkCourseMaterialExist,
} from '../repos/courseMaterialRepo';
import {
  ICourseMaterial,
  ITrackCourseMaterialView,
  ICourseMaterialWithStatus,
} from '../../types/coursematerial/courseMaterialModel';
import { checkUserIdExist } from '../../user/repos/registerUserRepo';

export const getAllCourseMaterialUseCase = async (): Promise<ICourseMaterial[]> => {
  const courseMaterialRepo = new CourseMaterialRepo();
  const result = await courseMaterialRepo.findAllCourseMaterials();
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

/*
export const getCourseMaterialBySubCategoryIdUseCase = async (
  categoryId: string,
): Promise<ICourseMaterial[]> => {
  const courseMaterialRepo = new CourseMaterialRepo();
  const result = await courseMaterialRepo.findCourseMaterialBySubCategoryId(categoryId);
  if (!result || result.length === 0) {
    throw new AppError('No data found', HttpStatus.NOT_FOUND);
  }
  return result;
};
*/

export const getCourseMaterialBySubCategoryIdUseCase = async (
  categoryId: string,
  userId: string,
  type: string,
): Promise<ICourseMaterialWithStatus[]> => {
  const courseMaterialRepo = new CourseMaterialRepo();
  const courseMaterials = await courseMaterialRepo.findCourseMaterialBySubCategoryId(
    categoryId,
    userId,
    type,
  );
  if (!courseMaterials || courseMaterials.length === 0) {
    throw new AppError('No data found', HttpStatus.NOT_FOUND);
  }
  return courseMaterials;
};

export const trackCourseMaterialUserUseCase = async (
  data: ITrackCourseMaterialView,
): Promise<boolean> => {
  const userExist = await checkUserIdExist(data.userId);
  if (!userExist) throw new AppError('User Not Found', HttpStatus.BAD_REQUEST);
  const courseMaterialExist = await checkCourseMaterialExist(data.courseMaterialId);
  if (!courseMaterialExist)
    throw new AppError('courseMaterialId Not Found', HttpStatus.BAD_REQUEST);
  //check already viewed
  const trackExist = await checkUserCourseIdExist(data.userId, data.courseMaterialId);
  if (!trackExist) await trackCourseMaterial(data);
  return true;
};
