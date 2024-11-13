import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import {
  CourseMaterialRepo,
  checkUserCourseIdExist,
  trackCourseMaterial,
  checkCourseMaterialExist,
  saveCourseMaterial,
  updateCourseMaterial,
} from '../repos/courseMaterialRepo';
import {
  ICourseMaterial,
  ITrackCourseMaterialView,
  ICourseMaterialWithStatus,
  ICourseMaterialBody,
} from '../../types/coursematerial/courseMaterialModel';
import { checkStudentIdExist } from '../../student/repos/studentRepo';
import { checkSubCategoryExists } from '../../subcategory/repos/subCategoryRepo';

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
  studentId: string,
): Promise<ICourseMaterialWithStatus[]> => {
  const courseMaterialRepo = new CourseMaterialRepo();
  const courseMaterials = await courseMaterialRepo.findCourseMaterialBySubCategoryId(
    categoryId,
    userId,
    type,
    studentId,
  );
  if (!courseMaterials || courseMaterials.length === 0) {
    throw new AppError('No data found', HttpStatus.NOT_FOUND);
  }
  return courseMaterials;
};

export const trackCourseMaterialUserUseCase = async (
  data: ITrackCourseMaterialView,
  userId: string
): Promise<boolean> => {
  const studentExist = await checkStudentIdExist(data.studentId, userId);
  if (!studentExist) throw new AppError('student Not Found', HttpStatus.BAD_REQUEST);
  const courseMaterialExist = await checkCourseMaterialExist(data.courseMaterialId);
  if (!courseMaterialExist)
    throw new AppError('courseMaterialId Not Found', HttpStatus.BAD_REQUEST);
  //check already viewed
  const trackExist = await checkUserCourseIdExist(data.studentId, data.courseMaterialId);
  if (!trackExist) await trackCourseMaterial(data);
  return true;
};

export const createCourseMaterialUseCase = async (
  data: ICourseMaterialBody,
): Promise<Pick<ICourseMaterial, '_id'>> => {
  const exists = await checkSubCategoryExists(data.subCategoryId);
  if (!exists) {
    throw new AppError('No sub categories found for the given subCategoryId', HttpStatus.NOT_FOUND);
  }
  const result = await saveCourseMaterial(data);
  return result;
};

export const updateCourseMaterialUseCase = async (
  id: string,
  data: ICourseMaterialBody,
): Promise<Pick<ICourseMaterial, '_id'>> => {
  const exists = await checkSubCategoryExists(data.subCategoryId);
  if (!exists) {
    throw new AppError('No sub categories found for the given subCategoryId', HttpStatus.NOT_FOUND);
  }
  const result = await updateCourseMaterial(id, data);
  return result;
};
