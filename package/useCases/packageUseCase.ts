import AppError from '../../common/appError';
import { HttpStatus } from '../../common/httpStatus';
//import { IPackageBody } from '../../types/package/packageModel';
import { PackageRepo } from '../repos/packageRepo';

//export const getAllPackagesUseCase = async (data: IPackageBody): Promise<any> => {
export const getAllPackagesUseCase = async (): Promise<any> => {
  const packageRepo = new PackageRepo();
  const result = await packageRepo.findAllPackages();
  if (!result) throw new AppError('No data found', HttpStatus.INTERNAL_SERVER_ERROR);
  return result;
};
