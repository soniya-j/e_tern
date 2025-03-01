import packageCostModel from '../models/packageCostModel';
import { IPackageCost } from '../../types/packagecost/packageCostModel';
import { ClientSession } from 'mongoose';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { ObjectID } from '../../utils/objectIdParser';
import { IPackageCostBody } from '../../types/packagecost/packageCostModel';

export class PackageCostRepo {
  async findAllPackageCosts(): Promise<IPackageCost[]> {
    return await packageCostModel
      .find({ isActive: true, isDeleted: false })
      .sort({ createdAt: -1 });
  }

  async findPackageCostsByPackageId(packageId: string): Promise<IPackageCost[]> {
    return await packageCostModel
      .find({ packageId, isActive: true, isDeleted: false })
      .sort({ createdAt: -1 });
  }
}

export const deletePackageCost = async (
  packageId: string,
  options: { session?: ClientSession } = {},
): Promise<{ _id: string }> => {
  const result: any = await packageCostModel.updateMany(
    { packageId },
    { isDeleted: true, modifiedOn: new Date().toISOString() },
    { new: true, session: options.session },
  );
  if (!result) {
    throw new AppError('No document found with the Id', HttpStatus.NOT_FOUND);
  }
  return result;
};

export const packageCostDetail = async (packageId: string, id: string) => {
  const result = await packageCostModel
    .findOne(
      {
        _id: ObjectID(id),
        packageId,
      },
      {
        price: 1,
        validity: 1,
      },
    )
    .lean();
  return result;
};

export const savePackageCosts = async (
  packageId: string,
  costs: IPackageCostBody[],
): Promise<void> => {
  const packageCosts = costs.map((cost) => ({ ...cost, packageId }));
  await packageCostModel.insertMany(packageCosts);
};

export const updatePackageCosts = async (
  packageId: string,
  packageCosts: IPackageCost[],
): Promise<void> => {
  await packageCostModel.findByIdAndUpdate(packageId, { $set: { packageCosts } }, { new: true });
};
