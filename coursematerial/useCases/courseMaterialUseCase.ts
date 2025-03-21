import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import {
  CourseMaterialRepo,
  checkUserCourseIdExist,
  trackCourseMaterial,
  checkCourseMaterialExist,
  saveCourseMaterial,
  updateCourseMaterial,
  saveCourseMaterialWatchHistory,
  deleteCourseMaterial,
  getWatchHistoriesBySubCategories,
  getCourseMaterialsBySubCategories,
  getTrendingVideos,
} from '../repos/courseMaterialRepo';
import {
  ICourseMaterial,
  ITrackCourseMaterialView,
  ICourseMaterialWithStatus,
  ICourseMaterialBody,
  ICourseMaterialWatchHistoryBody,
  IWatchHistory,
} from '../../types/coursematerial/courseMaterialModel';
import { checkStudentIdExist } from '../../student/repos/studentRepo';
import { checkSubCategoryExists, SubCategoryRepo } from '../../subcategory/repos/subCategoryRepo';
import { ISubCategory } from '../../types/subcategory/subCategoryModel';

export const getAllCourseMaterialUseCase = async (
  filters: Partial<ICourseMaterial>,
  limit?: number,
  page?: number,
): Promise<{ data: ICourseMaterial[]; totalCount: number }> => {
  const courseMaterialRepo = new CourseMaterialRepo();
  const result = await courseMaterialRepo.findAllCourseMaterials(filters, limit, page);
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
  userId: string,
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

export const courseMaterialWatchHistoryUseCase = async (
  data: ICourseMaterialWatchHistoryBody,
  userId: string,
): Promise<boolean> => {
  const studentExist = await checkStudentIdExist(data.studentId, userId);
  if (!studentExist) throw new AppError('student Not Found', HttpStatus.BAD_REQUEST);
  const courseMaterialExist = await checkCourseMaterialExist(
    data.courseMaterialId,
    data.subCategoryId,
  );
  if (!courseMaterialExist)
    throw new AppError('courseMaterialId Not Found', HttpStatus.BAD_REQUEST);
  await saveCourseMaterialWatchHistory(data);
  return true;
};

export const deleteCourseMaterialUseCase = async (id: string): Promise<boolean> => {
  const result = await deleteCourseMaterial(id);
  if (!result) {
    throw new AppError('Failed to delete Course material', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return true;
};

export const getCourseMaterialsByIdUseCase = async (id: string): Promise<ICourseMaterial[]> => {
  const courseMaterialRepo = new CourseMaterialRepo();
  const result = await courseMaterialRepo.findCourseMaterialsById(id);
  if (!result || result.length === 0) {
    throw new AppError('No Course Materials found for the given id', HttpStatus.NOT_FOUND);
  }
  return result;
};

export const getVideoDetailsUseCase = async () => {
  try {
    // Fetch all active subcategories
    const subCategoryRepo = new SubCategoryRepo();

    const subCategories: ISubCategory[] = await subCategoryRepo.findSubCategories();
    if (!subCategories.length) {
      return [];
    }

    const subCategoryIds = subCategories.map((sub) => sub._id);

    // Fetch all course materials for these subcategories
    const courseMaterials: ICourseMaterial[] =
      await getCourseMaterialsBySubCategories(subCategoryIds);

    // Fetch all watch histories for these subcategories
    const watchHistories: IWatchHistory[] = await getWatchHistoriesBySubCategories(subCategoryIds);

    // Process data for each subcategory
    const result = subCategories.map((subCategory) => {
      const materialsForSubCategory = courseMaterials.filter(
        (mat) => String(mat.subCategoryId) === String(subCategory._id),
      );
      const totalCourseMaterials = materialsForSubCategory.length;

      const totalDuration = materialsForSubCategory.reduce(
        (sum, mat) => sum + Number(mat.duration || 0),
        0,
      );

      const historiesForSubCategory = watchHistories.filter(
        (hist) => String(hist.subCategoryId) === String(subCategory._id),
      );
      let studentsCompleted = 0;
      const totalStudents = new Set<string>();

      historiesForSubCategory.forEach((history) => {
        totalStudents.add(history.studentId);
        const courseMaterial = materialsForSubCategory.find(
          (mat) => String(mat._id) === String(history.courseMaterialId),
        );

        if (courseMaterial && history.watchedDuration >= (courseMaterial.duration ?? 0)) {
          studentsCompleted++;
        }
      });

      const totalUniqueStudents = totalStudents.size;
      const completedPercentage =
        totalUniqueStudents > 0 ? (studentsCompleted / totalUniqueStudents) * 100 : 0;

      return {
        subCategoryName: subCategory.subCategoryName,
        subCategoryImageUrl: subCategory.imageUrl,
        categoryName:
          typeof subCategory.categoryId === 'object' && subCategory.categoryId !== null
            ? subCategory.categoryId.categoryName
            : 'Unknown',
        totalCourseMaterials,
        totalDuration,
        studentsCompletedPercentage: `${completedPercentage.toFixed(2)}`,
      };
    });

    return result;
  } catch (error: any) {
    console.error('Error in getDashboardVideoDetailsUseCase:', error.message);
    throw error;
  }
};

export const getTrendingVideoDetailsUseCase = async () => {
  const result = await getTrendingVideos();
  if (!result) {
    throw new AppError('Failed to get data', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return result;
};
