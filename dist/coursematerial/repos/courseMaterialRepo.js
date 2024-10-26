"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourseMaterialTrackBySubCategory = exports.getCourseMaterialTrack = exports.checkCourseMaterialExist = exports.trackCourseMaterial = exports.checkUserCourseIdExist = exports.CourseMaterialRepo = void 0;
const courseMaterialModel_1 = __importDefault(require("../models/courseMaterialModel"));
const courseMaterialViewModel_1 = __importDefault(require("../models/courseMaterialViewModel"));
class CourseMaterialRepo {
    async findAllCourseMaterials() {
        return await courseMaterialModel_1.default
            .find({ isActive: true, isDeleted: false })
            .sort({ sorting: 1 });
    }
    async findCourseMaterialBySubCategoryId(subCategoryId, userId) {
        const courseMaterials = await courseMaterialModel_1.default
            .find({ subCategoryId, isActive: true, isDeleted: false })
            .sort({ sorting: 1 })
            .lean();
        if (userId) {
            // Fetch viewed materials for the user
            const viewedMaterials = await courseMaterialViewModel_1.default.find({ userId, isActive: true }).lean();
            const viewedMaterialIds = new Set(viewedMaterials.map((view) => view.courseMaterialId.toString()));
            return courseMaterials.map((material) => ({
                ...material,
                viewedStatus: viewedMaterialIds.has(material._id.toString()), // Add viewed status
            }));
        }
        else {
            return courseMaterials;
        }
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
