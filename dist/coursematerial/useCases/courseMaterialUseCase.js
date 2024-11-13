"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCourseMaterialUseCase = exports.createCourseMaterialUseCase = exports.trackCourseMaterialUserUseCase = exports.getCourseMaterialBySubCategoryIdUseCase = exports.getAllCourseMaterialUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const courseMaterialRepo_1 = require("../repos/courseMaterialRepo");
const studentRepo_1 = require("../../student/repos/studentRepo");
const subCategoryRepo_1 = require("../../subcategory/repos/subCategoryRepo");
const getAllCourseMaterialUseCase = async () => {
    const courseMaterialRepo = new courseMaterialRepo_1.CourseMaterialRepo();
    const result = await courseMaterialRepo.findAllCourseMaterials();
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
const trackCourseMaterialUserUseCase = async (data) => {
    const studentExist = await (0, studentRepo_1.checkStudentIdExist)(data.studentId);
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
