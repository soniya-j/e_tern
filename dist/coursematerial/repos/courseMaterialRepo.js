"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingVideos = exports.getWatchHistoriesBySubCategories = exports.getCourseMaterialsBySubCategories = exports.checkSubCategoryIsChoosed = exports.deleteCourseMaterial = exports.saveCourseMaterialWatchHistory = exports.updateCourseMaterial = exports.saveCourseMaterial = exports.getCourseMaterialTrackByCategory = exports.getCourseMaterialTrackBySubCategory = exports.getCourseMaterialTrack = exports.checkCourseMaterialExist = exports.trackCourseMaterial = exports.checkUserCourseIdExist = exports.CourseMaterialRepo = void 0;
const courseMaterialModel_1 = __importDefault(require("../models/courseMaterialModel"));
const courseMaterialViewModel_1 = __importDefault(require("../models/courseMaterialViewModel"));
const subCategoryModel_1 = __importDefault(require("../../subcategory/models/subCategoryModel"));
const objectIdParser_1 = require("../../utils/objectIdParser");
const studentModel_1 = __importDefault(require("../../student/models/studentModel"));
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const courseMaterialWatchHistoryModel_1 = __importDefault(require("../models/courseMaterialWatchHistoryModel"));
const objectIdParser_2 = require("../../utils/objectIdParser");
class CourseMaterialRepo {
    async findAllCourseMaterials(filters, limit = 10, page = 1) {
        const query = {};
        if (filters.courseMaterialName) {
            query.subCategoryName = { $regex: filters.courseMaterialName, $options: 'i' };
        }
        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        query.isDeleted = false;
        const skip = (page - 1) * limit;
        const data = await courseMaterialModel_1.default
            .find(query)
            .populate({
            path: 'subCategoryId',
            match: { isDeleted: false },
            select: 'subCategoryName categoryId',
            populate: {
                path: 'categoryId',
                match: { isDeleted: false },
                select: 'categoryName',
            },
        })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 })
            .lean();
        const totalCount = await courseMaterialModel_1.default.countDocuments(query);
        return {
            data,
            totalCount,
        };
    }
    async findCourseMaterialBySubCategoryId(subCategoryId, userId, type, studentId) {
        const student = await studentModel_1.default.findOne({ _id: studentId, isDeleted: false }).lean();
        if (!student)
            throw new appError_1.default('Student Not Found', httpStatus_1.HttpStatus.BAD_REQUEST);
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
                .find({ subCategoryId, type, isActive: true, isDeleted: false })
                .sort({ sorting: 1 })
                //.limit(1)
                .lean());
        }
        let openStatusIndex = 0;
        const viewedMaterialIds = new Set();
        if (userId) {
            const viewedMaterials = await courseMaterialViewModel_1.default
                .find({ studentId, isActive: true })
                .lean();
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
    async findCourseMaterialsById(id) {
        return await courseMaterialModel_1.default
            .findOne({ _id: id, isDeleted: false })
            /*
            .populate({
              path: 'subCategoryId',
              select: 'categoryId',
              model: 'subcategory',
            })*/
            .populate({
            path: 'subCategoryId',
            select: 'categoryId subCategoryName',
            populate: {
                path: 'categoryId',
                select: 'categoryName',
            },
        })
            .lean();
    }
}
exports.CourseMaterialRepo = CourseMaterialRepo;
const checkUserCourseIdExist = async (studentId, courseMaterialId) => {
    return await courseMaterialViewModel_1.default
        .findOne({ studentId, courseMaterialId })
        .select({ _id: 1 })
        .lean();
};
exports.checkUserCourseIdExist = checkUserCourseIdExist;
const trackCourseMaterial = async (data) => {
    await courseMaterialViewModel_1.default.create({ ...data });
    return true;
};
exports.trackCourseMaterial = trackCourseMaterial;
const checkCourseMaterialExist = async (courseMaterialId, subCategoryId) => {
    const query = { _id: courseMaterialId, isDeleted: false };
    if (subCategoryId) {
        query.subCategoryId = subCategoryId;
    }
    return await courseMaterialModel_1.default.findOne(query).select({ _id: 1 }).lean();
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
const getCourseMaterialTrackByCategory = async (studentId, categoryId) => {
    const subCategories = await subCategoryModel_1.default
        .find({ categoryId, isActive: true, isDeleted: false })
        .select('_id');
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
        studentId,
        courseMaterialId: { $in: courseMaterialIds },
    });
    const totalMaterials = courseMaterials.length;
    const percentageViewed = totalMaterials > 0 ? (viewedMaterials / totalMaterials) * 100 : 0;
    return { totalMaterials, viewedMaterials, percentageViewed };
};
exports.getCourseMaterialTrackByCategory = getCourseMaterialTrackByCategory;
const saveCourseMaterial = async (data) => {
    const result = await courseMaterialModel_1.default.create(data);
    return { _id: result._id };
};
exports.saveCourseMaterial = saveCourseMaterial;
const updateCourseMaterial = async (id, data) => {
    const updatedRes = await courseMaterialModel_1.default.findByIdAndUpdate(id, data, { new: true });
    if (!updatedRes) {
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { _id: updatedRes._id };
};
exports.updateCourseMaterial = updateCourseMaterial;
const saveCourseMaterialWatchHistory = async (data) => {
    await courseMaterialWatchHistoryModel_1.default.create({ ...data });
    return true;
};
exports.saveCourseMaterialWatchHistory = saveCourseMaterialWatchHistory;
const deleteCourseMaterial = async (id) => {
    const result = await courseMaterialModel_1.default.findOneAndUpdate({ _id: (0, objectIdParser_2.ObjectID)(id) }, { isDeleted: true, modifiedOn: new Date().toISOString() }, { new: true });
    if (!result) {
        throw new appError_1.default('No document found with the Id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.deleteCourseMaterial = deleteCourseMaterial;
const checkSubCategoryIsChoosed = async (subCategoryId) => {
    return await courseMaterialModel_1.default
        .findOne({ subCategoryId, isDeleted: false })
        .select({ _id: 1 })
        .lean();
};
exports.checkSubCategoryIsChoosed = checkSubCategoryIsChoosed;
const getCourseMaterialsBySubCategories = async (subCategoryIds) => {
    return await courseMaterialModel_1.default
        .find({ subCategoryId: { $in: subCategoryIds }, isActive: true, isDeleted: false })
        .lean();
};
exports.getCourseMaterialsBySubCategories = getCourseMaterialsBySubCategories;
const getWatchHistoriesBySubCategories = async (subCategoryIds) => {
    return await courseMaterialWatchHistoryModel_1.default
        .find({ subCategoryId: { $in: subCategoryIds } })
        .lean();
};
exports.getWatchHistoriesBySubCategories = getWatchHistoriesBySubCategories;
const getTrendingVideos = async () => {
    return await courseMaterialWatchHistoryModel_1.default.aggregate([
        {
            $addFields: {
                courseMaterialId: { $toObjectId: '$courseMaterialId' },
                subCategoryId: { $toObjectId: '$subCategoryId' },
            },
        },
        {
            $group: {
                _id: {
                    courseMaterialId: '$courseMaterialId',
                    subCategoryId: '$subCategoryId',
                },
                repeatedViews: { $sum: 1 },
                distinctStudents: { $addToSet: '$studentId' },
            },
        },
        {
            $lookup: {
                from: 'coursematerials',
                localField: '_id.courseMaterialId',
                foreignField: '_id',
                as: 'courseMaterial',
            },
        },
        { $unwind: '$courseMaterial' },
        {
            $lookup: {
                from: 'subcategories',
                localField: '_id.subCategoryId',
                foreignField: '_id',
                as: 'subCategory',
            },
        },
        { $unwind: '$subCategory' },
        {
            $project: {
                courseMaterialName: '$courseMaterial.courseMaterialName',
                subCategoryName: '$subCategory.subCategoryName',
                repeatedViews: 1,
                distinctStudents: { $size: '$distinctStudents' },
            },
        },
        { $sort: { repeatedViews: -1 } },
    ]);
};
exports.getTrendingVideos = getTrendingVideos;
