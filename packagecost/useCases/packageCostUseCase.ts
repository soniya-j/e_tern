import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { PackageCostRepo } from '../repos/packageCostRepo';
import { IPackageCost } from '../../types/packagecost/packageCostModel';

export const getAllPackageCostsUseCase = async (): Promise<IPackageCost[]> => {
  const packageCostRepo = new PackageCostRepo();
  const result = await packageCostRepo.findAllPackageCosts();
  if (!result) throw new AppError('No data found', HttpStatus.NOT_FOUND);
  return result;
};

export const getPackageCostsByPackageIdUseCase = async (
  packageId: string,
): Promise<IPackageCost[]> => {
  const packageCostRepo = new PackageCostRepo();
  const result = await packageCostRepo.findPackageCostsByPackageId(packageId);

  if (!result || result.length === 0) {
    throw new AppError('No data found for the given package', HttpStatus.NOT_FOUND);
  }

  return result;
};
