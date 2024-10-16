import packageCostModel from '../models/packageCostModel';
import { IPackageCost } from '../../types/packagecost/packageCostModel';

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
