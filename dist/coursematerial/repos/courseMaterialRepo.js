"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseMaterialTrackByCategory = exports.getCourseMaterialTrackBySubCategory = exports.getCourseMaterialTrack = exports.checkCourseMaterialExist = exports.trackCourseMaterial = exports.checkUserCourseIdExist = exports.CourseMaterialRepo = void 0;
const courseMaterialModel_1 = __importDefault(require("../models/courseMaterialModel"));
const courseMaterialViewModel_1 = __importDefault(require("../models/courseMaterialViewModel"));
const subCategoryModel_1 = __importDefault(require("../../subcategory/models/subCategoryModel"));
const objectIdParser_1 = require("../../utils/objectIdParser");
const studentModel_1 = __importDefault(require("../../student/models/studentModel"));
class CourseMaterialRepo {
    async findAllCourseMaterials() {
        return await courseMaterialModel_1.default
            .find({ isActive: true, isDeleted: false })
            .sort({ sorting: 1 });
    }
    /*
    async findCourseMaterialBySubCategoryId(
      subCategoryId: string,
      userId: string,
      type: string,
    ): Promise<ICourseMaterial[]> {
      const courseMaterials = await courseMaterialModel
        .find({ subCategoryId, type, isActive: true, isDeleted: false })
        .sort({ sorting: 1 })
        .lean();
      if (userId) {
        // Fetch viewed materials for the user
        const viewedMaterials = await courseMaterialViewModel.find({ userId, isActive: true }).lean();
        const viewedMaterialIds = new Set(
          viewedMaterials.map((view) => view.courseMaterialId.toString()),
        );
        return courseMaterials.map((material) => ({
          ...material,
          viewedStatus: viewedMaterialIds.has(material._id.toString()),
        }));
      } else {
        return courseMaterials;
      }
    }
  */
    async findCourseMaterialBySubCategoryId(subCategoryId, userId, type, studentId) {
        /*
        const courseMaterials = (await courseMaterialModel
          .find({ subCategoryId, type, isActive: true, isDeleted: false })
          .sort({ sorting: 1 })
          .lean()) as unknown as ICourseMaterial[];
    */
        const student = await studentModel_1.default.findOne({ _id: studentId, isDeleted: false }).lean();
        const hasValidSubscription = student &&
            student.subscribed &&
            student.subscriptionEndDate &&
            student.subscriptionEndDate > new Date();
        let courseMaterials;
        // If the student has a valid subscription, get all materials; otherwise, get only the first one
        if (hasValidSubscription) {
            courseMaterials = (await courseMaterialModel_1.default
                .find({ subCategoryId, type, isActive: true, isDeleted: false })
                .sort({ sorting: 1 })
                .lean());
        }
        else {
            courseMaterials = (await courseMaterialModel_1.default
                .find({ subCategoryId, type, isActive: true, isDeleted: false, sorting: 1 })
                .limit(1)
                .lean());
        }
        let openStatusIndex = 0;
        const viewedMaterialIds = new Set();
        if (userId) {
            const viewedMaterials = await courseMaterialViewModel_1.default.find({ userId, isActive: true }).lean();
            viewedMaterials.forEach((view) => {
                viewedMaterialIds.add(view.courseMaterialId.toString());
            });
            courseMaterials.forEach((material, index) => {
                const materialId = (0, objectIdParser_1.objectIdToString)(material._id);
                if (viewedMaterialIds.has(materialId)) {
                    openStatusIndex = index + 1;
                }
            });
        }
        const courseMaterialsWithStatus = courseMaterials.map((material, index) => ({
            _id: (0, objectIdParser_1.objectIdToString)(material._id),
            courseMaterialName: material.courseMaterialName,
            subCategoryId: material.subCategoryId,
            courseMaterialUrl: material.courseMaterialUrl,
            sorting: material.sorting,
            description: material.description,
            isActive: material.isActive,
            isDeleted: material.isDeleted,
            type: material.type,
            viewedStatus: viewedMaterialIds.has((0, objectIdParser_1.objectIdToString)(material._id)),
            openStatus: index === openStatusIndex,
        }));
        return courseMaterialsWithStatus;
    }
}
exports.CourseMaterialRepo = CourseMaterialRepo;
const checkUserCourseIdExist = async (userId, courseMaterialId) => {
    return await courseMaterialViewModel_1.default
        .findOne({ userId, courseMaterialId })
        .select({ _id: 1 })
        .lean();
};
exports.checkUserCourseIdExist = checkUserCourseIdExist;
const trackCourseMaterial = async (data) => {
    await courseMaterialViewModel_1.default.create({ ...data });
    return true;
};
exports.trackCourseMaterial = trackCourseMaterial;
const checkCourseMaterialExist = async (courseMaterialId) => {
    return await courseMaterialModel_1.default.findOne({ _id: courseMaterialId }).select({ _id: 1 }).lean();
};
exports.checkCourseMaterialExist = checkCourseMaterialExist;
const getCourseMaterialTrack = async (userId) => {
    const totalMaterials = await courseMaterialModel_1.default.countDocuments({
        isActive: true,
        isDeleted: false,
    });
    const viewedMaterials = await courseMaterialViewModel_1.default.countDocuments({
        userId: userId,
        isActive: true,
    });
    const percentageViewed = totalMaterials > 0 ? Math.round((viewedMaterials / totalMaterials) * 100) : 0;
    return { totalMaterials, viewedMaterials, percentageViewed };
};
exports.getCourseMaterialTrack = getCourseMaterialTrack;
const getCourseMaterialTrackBySubCategory = async (userId, subCategoryId) => {
    const courseMaterials = await courseMaterialModel_1.default
        .find({
        subCategoryId,
        isActive: true,
        isDeleted: false,
    })
        .select('_id');
    const courseMaterialIds = courseMaterials.map((material) => material._id);
    const viewedMaterials = await courseMaterialViewModel_1.default.countDocuments({
        userId,
        courseMaterialId: { $in: courseMaterialIds },
    });
    const totalMaterials = courseMaterials.length;
    const percentageViewed = totalMaterials > 0 ? (viewedMaterials / totalMaterials) * 100 : 0;
    return { totalMaterials, viewedMaterials, percentageViewed };
};
exports.getCourseMaterialTrackBySubCategory = getCourseMaterialTrackBySubCategory;
const getCourseMaterialTrackByCategory = async (userId, categoryId) => {
    const subCategories = await subCategoryModel_1.default.find({ categoryId, isActive: true }).select('_id');
    const subCategoryIds = subCategories.map((subCategory) => subCategory._id);
    const courseMaterials = await courseMaterialModel_1.default
        .find({
        subCategoryId: { $in: subCategoryIds },
        isActive: true,
        isDeleted: false,
    })
        .select('_id');
    const courseMaterialIds = courseMaterials.map((material) => material._id);
    const viewedMaterials = await courseMaterialViewModel_1.default.countDocuments({
        userId,
        courseMaterialId: { $in: courseMaterialIds },
    });
    const totalMaterials = courseMaterials.length;
    const percentageViewed = totalMaterials > 0 ? (viewedMaterials / totalMaterials) * 100 : 0;
    return { totalMaterials, viewedMaterials, percentageViewed };
};
exports.getCourseMaterialTrackByCategory = getCourseMaterialTrackByCategory;
