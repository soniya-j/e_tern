import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { IPackageBody } from '../../types/package/packageModel';
import { IPackage } from '../../types/package/packageModel';
import { PackageRepo, savePackage, updatePackage, deletePackage } from '../repos/packageRepo';
import { packageIsSubscribed } from '../../student/repos/studentRepo';
import { startSession } from 'mongoose';
import { deletePackageCost } from '../../packagecost/repos/packageCostRepo';
import { IPackageCostBody } from '../../types/packagecost/packageCostModel';
import { savePackageCosts } from '../../packagecost/repos/packageCostRepo';

export const getAllPackagesUseCase = async (): Promise<IPackage[]> => {
  const packageRepo = new PackageRepo();
  //  const result = await packageRepo.findAllPackages();
  const result = await packageRepo.findAllPackagesWithCosts();

  if (!result) throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  return result;
};

export const getAllPackagesAdminUseCase = async (
  filters: Partial<IPackage>,
  limit?: number,
  page?: number,
): Promise<IPackage[]> => {
  const packageRepo = new PackageRepo();
  const result = await packageRepo.findAllPackagesWithCostsAdmin(filters, limit, page);

  if (!result) throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  return result;
};

/*
export const createPackageUseCase = async (data: IPackageBody): Promise<Pick<IPackage, '_id'>> => {
  const result = await savePackage(data);
  return result;
};
*/

export const createPackageUseCase = async (
  data: IPackageBody & { packageCosts: IPackageCostBody[] },
): Promise<{ packageId: string }> => {
  const { packageCosts, ...packageData } = data;
  // Save package
  const { _id: packageId } = await savePackage(packageData);
  // Save package costs with the packageId reference
  if (packageCosts && packageCosts.length > 0) {
    await savePackageCosts(packageId, packageCosts);
  }
  return { packageId };
};

export const updatePackageUseCase = async (
  packageId: string,
  data: IPackageBody,
): Promise<Pick<IPackage, '_id'>> => {
  const { packageCosts, ...packageDetails } = data;
  // Update package details
  const packageUpdateResult = await updatePackage(packageId, packageDetails);
  // update packageCosts
  const deletePackageCostResult = await deletePackageCost(packageId);
  if (!deletePackageCostResult) {
    throw new AppError('Failed to delete package cost', HttpStatus.INTERNAL_SERVER_ERROR);
  }
  if (packageCosts && packageCosts.length > 0) {
    await savePackageCosts(packageId, packageCosts);
  }
  return packageUpdateResult;
};

export const deletePackageUseCase = async (packageId: string): Promise<boolean> => {
  const session = await startSession();
  try {
    session.startTransaction();
    const checkPackageIsSubscribed = await packageIsSubscribed(packageId);
    if (checkPackageIsSubscribed) {
      throw new AppError(
        'Deletion not allowed as this package is currently subscribed by a user.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const deletePackageResult = await deletePackage(packageId, { session });
    if (!deletePackageResult) {
      throw new AppError('Failed to delete package', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const deletePackageCostResult = await deletePackageCost(packageId, { session });
    if (!deletePackageCostResult) {
      throw new AppError('Failed to delete package cost', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    await session.commitTransaction();
    return true;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const getPackagesByIdUseCase = async (id: string): Promise<IPackage> => {
  const packageRepo = new PackageRepo();
  const packageDetails = await packageRepo.findPackageWithCostsById(id);
  if (!packageDetails || packageDetails.length === 0) {
    throw new AppError('No Packages found for the given id', HttpStatus.NOT_FOUND);
  }
  return packageDetails;
};
