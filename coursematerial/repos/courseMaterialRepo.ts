import courseMaterialModel from '../models/courseMaterialModel';
import courseMaterialViewModel from '../models/courseMaterialViewModel';
import {
  ICourseMaterial,
  ITrackCourseMaterialView,
  ICourseMaterialWithStatus,
  ICourseMaterialBody,
} from '../../types/coursematerial/courseMaterialModel';
import subCategoryModel from '../../subcategory/models/subCategoryModel';
import { objectIdToString } from '../../utils/objectIdParser';
import { ObjectId } from 'mongodb';
import studentModel from '../../student/models/studentModel';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export class CourseMaterialRepo {
  async findAllCourseMaterials(): Promise<ICourseMaterial[]> {
    return await courseMaterialModel
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

  async findCourseMaterialBySubCategoryId(
    subCategoryId: string,
    userId: string,
    type: string,
    studentId: string,
  ): Promise<ICourseMaterialWithStatus[]> {
    const student = await studentModel.findOne({ _id: studentId, isDeleted: false }).lean();
    if (!student) throw new AppError('Student Not Found', HttpStatus.BAD_REQUEST);
    const hasValidSubscription =
      student &&
      student.subscribed &&
      student.subscriptionEndDate &&
      student.subscriptionEndDate > new Date();

    let courseMaterials: ICourseMaterial[];

    // If the student has a valid subscription, get all materials; otherwise, get only the first one
    if (hasValidSubscription) {
      courseMaterials = (await courseMaterialModel
        .find({ subCategoryId, type, isActive: true, isDeleted: false })
        .sort({ sorting: 1 })
        .lean()) as unknown as ICourseMaterial[];
    } else {
      courseMaterials = (await courseMaterialModel
        .find({ subCategoryId, type, isActive: true, isDeleted: false, sorting: 1 })
        .limit(1)
        .lean()) as unknown as ICourseMaterial[];
    }
    let openStatusIndex = 0;
    const viewedMaterialIds = new Set<string>();
    if (userId) {
      const viewedMaterials = await courseMaterialViewModel
        .find({ studentId, isActive: true })
        .lean();
      viewedMaterials.forEach((view) => {
        viewedMaterialIds.add(view.courseMaterialId.toString());
      });
      courseMaterials.forEach((material, index) => {
        const materialId = objectIdToString(material._id as ObjectId);
        if (viewedMaterialIds.has(materialId)) {
          openStatusIndex = index + 1;
        }
      });
    }

    const courseMaterialsWithStatus: ICourseMaterialWithStatus[] = courseMaterials.map(
      (material, index) => ({
        _id: objectIdToString(material._id as ObjectId),
        courseMaterialName: material.courseMaterialName,
        subCategoryId: material.subCategoryId,
        courseMaterialUrl: material.courseMaterialUrl,
        sorting: material.sorting,
        description: material.description,
        isActive: material.isActive,
        isDeleted: material.isDeleted,
        type: material.type,
        viewedStatus: viewedMaterialIds.has(objectIdToString(material._id as ObjectId)),
        openStatus: index === openStatusIndex,
      }),
    );

    return courseMaterialsWithStatus;
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

  let openStatusIndex = 0; // Default to the first item

  if (userId) {
    // Fetch viewed materials for the user
    const viewedMaterials = await courseMaterialViewModel.find({ userId, isActive: true }).lean();
    const viewedMaterialIds = new Set(
      viewedMaterials.map((view) => view.courseMaterialId.toString()),
    );

    // Update `viewedStatus` and determine the `openStatus` index
    courseMaterials.forEach((material, index) => {
      material.viewedStatus = viewedMaterialIds.has(material._id.toString());
      if (material.viewedStatus) openStatusIndex = index + 1;
    });
  }

  // Set openStatus only for the next course material after the last viewed one
  return courseMaterials.map((material, index) => ({
    ...material,
    viewedStatus: viewedMaterialIds.has(material._id.toString()),
    openStatus: index === openStatusIndex,
  }));
}
*/
}

export const checkUserCourseIdExist = async (
  studentId: string,
  courseMaterialId: string,
): Promise<{ _id: string } | null> => {
  return await courseMaterialViewModel
    .findOne({ studentId, courseMaterialId })
    .select({ _id: 1 })
    .lean();
};

export const trackCourseMaterial = async (data: ITrackCourseMaterialView): Promise<boolean> => {
  await courseMaterialViewModel.create({ ...data });
  return true;
};

export const checkCourseMaterialExist = async (
  courseMaterialId: string,
): Promise<{ _id: string } | null> => {
  return await courseMaterialModel.findOne({ _id: courseMaterialId }).select({ _id: 1 }).lean();
};

export const getCourseMaterialTrack = async (
  userId: string,
): Promise<{ totalMaterials: number; viewedMaterials: number; percentageViewed: number }> => {
  const totalMaterials = await courseMaterialModel.countDocuments({
    isActive: true,
    isDeleted: false,
  });
  const viewedMaterials = await courseMaterialViewModel.countDocuments({
    userId: userId,
    isActive: true,
  });
  const percentageViewed =
    totalMaterials > 0 ? Math.round((viewedMaterials / totalMaterials) * 100) : 0;
  return { totalMaterials, viewedMaterials, percentageViewed };
};

export const getCourseMaterialTrackBySubCategory = async (
  userId: string,
  subCategoryId: string,
): Promise<{ totalMaterials: number; viewedMaterials: number; percentageViewed: number }> => {
  const courseMaterials = await courseMaterialModel
    .find({
      subCategoryId,
      isActive: true,
      isDeleted: false,
    })
    .select('_id');
  const courseMaterialIds = courseMaterials.map((material) => material._id);
  const viewedMaterials = await courseMaterialViewModel.countDocuments({
    userId,
    courseMaterialId: { $in: courseMaterialIds },
  });
  const totalMaterials = courseMaterials.length;
  const percentageViewed = totalMaterials > 0 ? (viewedMaterials / totalMaterials) * 100 : 0;
  return { totalMaterials, viewedMaterials, percentageViewed };
};

export const getCourseMaterialTrackByCategory = async (
  studentId: string,
  categoryId: string,
): Promise<{ totalMaterials: number; viewedMaterials: number; percentageViewed: number }> => {
  const subCategories = await subCategoryModel
    .find({ categoryId, isActive: true, isDeleted: false })
    .select('_id');
  const subCategoryIds = subCategories.map((subCategory) => subCategory._id);

  const courseMaterials = await courseMaterialModel
    .find({
      subCategoryId: { $in: subCategoryIds },
      isActive: true,
      isDeleted: false,
    })
    .select('_id');

  const courseMaterialIds = courseMaterials.map((material) => material._id);
  const viewedMaterials = await courseMaterialViewModel.countDocuments({
    studentId,
    courseMaterialId: { $in: courseMaterialIds },
  });

  const totalMaterials = courseMaterials.length;
  const percentageViewed = totalMaterials > 0 ? (viewedMaterials / totalMaterials) * 100 : 0;

  return { totalMaterials, viewedMaterials, percentageViewed };
};

export const saveCourseMaterial = async (data: ICourseMaterialBody): Promise<{ _id: string }> => {
  const result = await courseMaterialModel.create(data);
  return { _id: result._id as string };
};

export const updateCourseMaterial = async (
  id: string,
  data: ICourseMaterialBody,
): Promise<{ _id: string }> => {
  const updatedRes = await courseMaterialModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedRes) {
    throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return { _id: updatedRes._id as string };
};
