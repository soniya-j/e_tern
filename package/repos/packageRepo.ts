import packageModel from '../models/packageModel';
import { IPackage, IPackageBody } from '../../types/package/packageModel';
import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { ObjectID } from '../../utils/objectIdParser';
import { ClientSession } from 'mongoose';
import packageCostModel from '../../packagecost/models/packageCostModel';
import mongoose from 'mongoose';

export class PackageRepo {
  async findAllPackages(): Promise<IPackage[]> {
    return await packageModel.find({ isActive: true, isDeleted: false }).sort({ createdAt: -1 });
  }

  async findAllPackagesWithCosts(): Promise<any[]> {
    return await packageModel.aggregate([
      {
        $match: {
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $addFields: {
          packageIdAsString: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: packageCostModel.collection.name,
          localField: 'packageIdAsString',
          foreignField: 'packageId',
          as: 'packageCosts',
        },
      },
      {
        $project: {
          _id: 1,
          packageName: 1,
          ageFrom: 1,
          ageTo: 1,
          description: 1,
          isActive: 1,
          isDeleted: 1,
          createdAt: 1,
          updatedAt: 1,
          packageCosts: {
            $filter: {
              input: '$packageCosts',
              as: 'cost',
              cond: {
                $and: [{ $eq: ['$$cost.isActive', true] }, { $eq: ['$$cost.isDeleted', false] }],
              },
            },
          },
        },
      },
      {
        $project: {
          packageIdAsString: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
  }

  async findAllPackagesWithCostsAdmin(
    filters: any = {},
    limit?: number,
    page?: number,
  ): Promise<any[]> {
    const query: any = {
      isDeleted: false,
    };

    if (filters.packageName) {
      query.packageName = { $regex: filters.packageName, $options: 'i' };
    }
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const pipeline: any[] = [
      {
        $match: query,
      },
      {
        $addFields: {
          packageIdAsString: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: packageCostModel.collection.name,
          localField: 'packageIdAsString',
          foreignField: 'packageId',
          as: 'packageCosts',
        },
      },
      {
        $project: {
          _id: 1,
          packageName: 1,
          ageFrom: 1,
          ageTo: 1,
          description: 1,
          isActive: 1,
          isDeleted: 1,
          createdAt: 1,
          updatedAt: 1,
          packageCosts: {
            $filter: {
              input: '$packageCosts',
              as: 'cost',
              cond: {
                $and: [{ $eq: ['$$cost.isActive', true] }, { $eq: ['$$cost.isDeleted', false] }],
              },
            },
          },
        },
      },
      {
        $project: {
          packageIdAsString: 0,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    // Add pagination stages if `limit` and `page` are defined
    if (limit !== undefined && page !== undefined) {
      const skip = (page - 1) * limit;
      pipeline.push({ $skip: skip }, { $limit: limit });
    }
    return await packageModel.aggregate(pipeline);
  }
  /*
  async findPackagesById(id: string): Promise<IPackage | null> {
    return await packageModel.findOne({ _id: id, isDeleted: false }).lean();
  }
*/

  async findPackageWithCostsById(packageId: string): Promise<any> {
    return await packageModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(packageId),
          isActive: true,
          isDeleted: false,
        },
      },
      {
        $addFields: {
          packageIdAsString: { $toString: '$_id' },
        },
      },
      {
        $lookup: {
          from: packageCostModel.collection.name,
          localField: 'packageIdAsString',
          foreignField: 'packageId',
          as: 'packageCosts',
        },
      },
      {
        $project: {
          _id: 1,
          packageName: 1,
          ageFrom: 1,
          ageTo: 1,
          description: 1,
          isActive: 1,
          isDeleted: 1,
          createdAt: 1,
          updatedAt: 1,
          packageCosts: {
            $filter: {
              input: '$packageCosts',
              as: 'cost',
              cond: {
                $and: [{ $eq: ['$$cost.isActive', true] }, { $eq: ['$$cost.isDeleted', false] }],
              },
            },
          },
        },
      },
      {
        $project: {
          packageIdAsString: 0,
        },
      },
    ]);
  }
}

export const savePackage = async (data: IPackageBody): Promise<{ _id: string }> => {
  const user = await packageModel.create(data);
  return { _id: user._id as string };
};

export const checkPackageExists = async (id: string) => {
  const result = await packageModel.findOne({
    _id: ObjectID(id),
  });
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

export const deletePackage = async (
  id: string,
  options: { session?: ClientSession } = {},
): Promise<{ _id: string }> => {
  const result: any = await packageModel.findOneAndUpdate(
    { _id: ObjectID(id) },
    { isDeleted: true, modifiedOn: new Date().toISOString() },
    { new: true, session: options.session },
  );
  if (!result) {
    throw new AppError('No document found with the Id', HttpStatus.NOT_FOUND);
  }
  return result;
};
