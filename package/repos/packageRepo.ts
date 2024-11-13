import packageModel from '../models/packageModel';
import { IPackage, IPackageBody } from '../../types/package/packageModel';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';

export class PackageRepo {
  async findAllPackages(): Promise<IPackage[]> {
    return await packageModel.find({ isActive: true, isDeleted: false }).sort({ createdAt: -1 });
  }
}

export const savePackage = async (data: IPackageBody): Promise<{ _id: string }> => {
  const user = await packageModel.create(data);
  return { _id: user._id as string };
};

export const checkPackageExists = async (id: string) => {
  const result = await packageModel.findById(id);
  return !!result;
};

export const updatePackage = async (
  packageId: string,
  data: IPackageBody,
): Promise<{ _id: string }> => {
  const updatedRes = await packageModel.findByIdAndUpdate(packageId, data, { new: true });
  if (!updatedRes) {
    throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  return { _id: updatedRes._id as string };
};
