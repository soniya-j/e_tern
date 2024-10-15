//import { IPackageBody } from '../../types/package/packageTypes';
//import { ObjectID } from '../../utils/objectIdParser';
import packageModel from '../models/packageModel';
import { IPackage } from '../../types/package/packageModel';

export class PackageRepo {
  async findAllPackages(): Promise<IPackage[]> {
    return await packageModel.find({ isActive: true, isDeleted: false }).sort({ createdAt: -1 });
  }
}
