import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
import { IPackageBody } from '../../types/package/packageModel';
import { IPackage } from '../../types/package/packageModel';
import { PackageRepo, savePackage, updatePackage } from '../repos/packageRepo';

export const getAllPackagesUseCase = async (): Promise<IPackage[]> => {
  const packageRepo = new PackageRepo();
  const result = await packageRepo.findAllPackages();
  if (!result) throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  return result;
};

export const createPackageUseCase = async (data: IPackageBody): Promise<Pick<IPackage, '_id'>> => {
  const result = await savePackage(data);
  return result;
};

export const updatePackageUseCase = async (
  packageId: string,
  data: IPackageBody,
): Promise<Pick<IPackage, '_id'>> => {
  const result = await updatePackage(packageId, data);
  return result;
};
