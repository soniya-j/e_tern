"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackCourseMaterialUserUseCase = exports.getCourseMaterialBySubCategoryIdUseCase = exports.getAllCourseMaterialUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const courseMaterialRepo_1 = require("../repos/courseMaterialRepo");
const registerUserRepo_1 = require("../../user/repos/registerUserRepo");
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
    const userExist = await (0, registerUserRepo_1.checkUserIdExist)(data.userId);
    if (!userExist)
        throw new appError_1.default('User Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    const courseMaterialExist = await (0, courseMaterialRepo_1.checkCourseMaterialExist)(data.courseMaterialId);
    if (!courseMaterialExist)
        throw new appError_1.default('courseMaterialId Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
    //check already viewed
    const trackExist = await (0, courseMaterialRepo_1.checkUserCourseIdExist)(data.userId, data.courseMaterialId);
    if (!trackExist)
        await (0, courseMaterialRepo_1.trackCourseMaterial)(data);
    return true;
};
exports.trackCourseMaterialUserUseCase = trackCourseMaterialUserUseCase;
