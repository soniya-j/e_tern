"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingVideoDetailsUseCase = exports.getVideoDetailsUseCase = exports.getCourseMaterialsByIdUseCase = exports.deleteCourseMaterialUseCase = exports.courseMaterialWatchHistoryUseCase = exports.updateCourseMaterialUseCase = exports.createCourseMaterialUseCase = exports.trackCourseMaterialUserUseCase = exports.getCourseMaterialBySubCategoryIdUseCase = exports.getAllCourseMaterialUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const courseMaterialRepo_1 = require("../repos/courseMaterialRepo");
const studentRepo_1 = require("../../student/repos/studentRepo");
const subCategoryRepo_1 = require("../../subcategory/repos/subCategoryRepo");
const getAllCourseMaterialUseCase = async (filters, limit, page) => {
    const courseMaterialRepo = new courseMaterialRepo_1.CourseMaterialRepo();
    const result = await courseMaterialRepo.findAllCourseMaterials(filters, limit, page);
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getAllCourseMaterialUseCase = getAllCourseMaterialUseCase;
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
const getCourseMaterialBySubCategoryIdUseCase = async (categoryId, userId, type, studentId) => {
    const courseMaterialRepo = new courseMaterialRepo_1.CourseMaterialRepo();
    const courseMaterials = await courseMaterialRepo.findCourseMaterialBySubCategoryId(categoryId, userId, type, studentId);
    if (!courseMaterials || courseMaterials.length === 0) {
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return courseMaterials;
};
exports.getCourseMaterialBySubCategoryIdUseCase = getCourseMaterialBySubCategoryIdUseCase;
const trackCourseMaterialUserUseCase = async (data, userId) => {
    const studentExist = await (0, studentRepo_1.checkStudentIdExist)(data.studentId, userId);
    if (!studentExist)
        throw new appError_1.default('student Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    const courseMaterialExist = await (0, courseMaterialRepo_1.checkCourseMaterialExist)(data.courseMaterialId);
    if (!courseMaterialExist)
        throw new appError_1.default('courseMaterialId Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    //check already viewed
    const trackExist = await (0, courseMaterialRepo_1.checkUserCourseIdExist)(data.studentId, data.courseMaterialId);
    if (!trackExist)
        await (0, courseMaterialRepo_1.trackCourseMaterial)(data);
    return true;
};
exports.trackCourseMaterialUserUseCase = trackCourseMaterialUserUseCase;
const createCourseMaterialUseCase = async (data) => {
    const exists = await (0, subCategoryRepo_1.checkSubCategoryExists)(data.subCategoryId);
    if (!exists) {
        throw new appError_1.default('No sub categories found for the given subCategoryId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const result = await (0, courseMaterialRepo_1.saveCourseMaterial)(data);
    return result;
};
exports.createCourseMaterialUseCase = createCourseMaterialUseCase;
const updateCourseMaterialUseCase = async (id, data) => {
    const exists = await (0, subCategoryRepo_1.checkSubCategoryExists)(data.subCategoryId);
    if (!exists) {
        throw new appError_1.default('No sub categories found for the given subCategoryId', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    const result = await (0, courseMaterialRepo_1.updateCourseMaterial)(id, data);
    return result;
};
exports.updateCourseMaterialUseCase = updateCourseMaterialUseCase;
const courseMaterialWatchHistoryUseCase = async (data, userId) => {
    const studentExist = await (0, studentRepo_1.checkStudentIdExist)(data.studentId, userId);
    if (!studentExist)
        throw new appError_1.default('student Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    const courseMaterialExist = await (0, courseMaterialRepo_1.checkCourseMaterialExist)(data.courseMaterialId, data.subCategoryId);
    if (!courseMaterialExist)
        throw new appError_1.default('courseMaterialId Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    await (0, courseMaterialRepo_1.saveCourseMaterialWatchHistory)(data);
    return true;
};
exports.courseMaterialWatchHistoryUseCase = courseMaterialWatchHistoryUseCase;
const deleteCourseMaterialUseCase = async (id) => {
    const result = await (0, courseMaterialRepo_1.deleteCourseMaterial)(id);
    if (!result) {
        throw new appError_1.default('Failed to delete Course material', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
};
exports.deleteCourseMaterialUseCase = deleteCourseMaterialUseCase;
const getCourseMaterialsByIdUseCase = async (id) => {
    const courseMaterialRepo = new courseMaterialRepo_1.CourseMaterialRepo();
    const result = await courseMaterialRepo.findCourseMaterialsById(id);
    if (!result || result.length === 0) {
        throw new appError_1.default('No Course Materials found for the given id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getCourseMaterialsByIdUseCase = getCourseMaterialsByIdUseCase;
const getVideoDetailsUseCase = async () => {
    try {
        // Fetch all active subcategories
        const subCategoryRepo = new subCategoryRepo_1.SubCategoryRepo();
        const subCategories = await subCategoryRepo.findSubCategories();
        if (!subCategories.length) {
            return [];
        }
        const subCategoryIds = subCategories.map((sub) => sub._id);
        // Fetch all course materials for these subcategories
        const courseMaterials = await (0, courseMaterialRepo_1.getCourseMaterialsBySubCategories)(subCategoryIds);
        // Fetch all watch histories for these subcategories
        const watchHistories = await (0, courseMaterialRepo_1.getWatchHistoriesBySubCategories)(subCategoryIds);
        // Process data for each subcategory
        const result = subCategories.map((subCategory) => {
            const materialsForSubCategory = courseMaterials.filter((mat) => String(mat.subCategoryId) === String(subCategory._id));
            const totalCourseMaterials = materialsForSubCategory.length;
            const totalDuration = materialsForSubCategory.reduce((sum, mat) => sum + Number(mat.duration || 0), 0);
            const historiesForSubCategory = watchHistories.filter((hist) => String(hist.subCategoryId) === String(subCategory._id));
            let studentsCompleted = 0;
            const totalStudents = new Set();
            historiesForSubCategory.forEach((history) => {
                totalStudents.add(history.studentId);
                const courseMaterial = materialsForSubCategory.find((mat) => String(mat._id) === String(history.courseMaterialId));
                if (courseMaterial && history.watchedDuration >= (courseMaterial.duration ?? 0)) {
                    studentsCompleted++;
                }
            });
            const totalUniqueStudents = totalStudents.size;
            const completedPercentage = totalUniqueStudents > 0 ? (studentsCompleted / totalUniqueStudents) * 100 : 0;
            return {
                subCategoryName: subCategory.subCategoryName,
                subCategoryImageUrl: subCategory.imageUrl,
                categoryName: typeof subCategory.categoryId === 'object' && subCategory.categoryId !== null
                    ? subCategory.categoryId.categoryName
                    : 'Unknown',
                totalCourseMaterials,
                totalDuration,
                studentsCompletedPercentage: `${completedPercentage.toFixed(2)}`,
            };
        });
        return result;
    }
    catch (error) {
        console.error('Error in getDashboardVideoDetailsUseCase:', error.message);
        throw error;
    }
};
exports.getVideoDetailsUseCase = getVideoDetailsUseCase;
const getTrendingVideoDetailsUseCase = async () => {
    const result = await (0, courseMaterialRepo_1.getTrendingVideos)();
    if (!result) {
        throw new appError_1.default('Failed to get data', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return result;
};
exports.getTrendingVideoDetailsUseCase = getTrendingVideoDetailsUseCase;
