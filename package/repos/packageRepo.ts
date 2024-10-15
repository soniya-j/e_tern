//import { IPackageBody } from '../../types/package/packageTypes';
//import { ObjectID } from '../../utils/objectIdParser';
import packageModel from '../models/packageModel';

export class PackageRepo {
  async findAllPackages() {
    return await packageModel.find({ isActive: true });
  }
}
