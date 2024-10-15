import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
//import { IPackageBody } from '../../types/package/packageModel';
import { IPackage } from '../../types/package/packageModel';
import { PackageRepo } from '../repos/packageRepo';

export const getAllPackagesUseCase = async (): Promise<IPackage[]> => {
  const packageRepo = new PackageRepo();
  const result = await packageRepo.findAllPackages();
  if (!result) throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  return result;
};
