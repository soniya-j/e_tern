"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePackage = exports.updatePackage = exports.checkPackageExists = exports.savePackage = exports.PackageRepo = void 0;
const packageModel_1 = __importDefault(require("../models/packageModel"));
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const objectIdParser_1 = require("../../utils/objectIdParser");
const packageCostModel_1 = __importDefault(require("../../packagecost/models/packageCostModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class PackageRepo {
    async findAllPackages() {
        return await packageModel_1.default.find({ isActive: true, isDeleted: false }).sort({ createdAt: -1 });
    }
    async findAllPackagesWithCosts() {
        return await packageModel_1.default.aggregate([
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
                    from: packageCostModel_1.default.collection.name,
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
    async findAllPackagesWithCostsAdmin(filters = {}, limit, page) {
        const query = {
            isDeleted: false,
        };
        if (filters.packageName) {
            query.packageName = { $regex: filters.packageName, $options: 'i' };
        }
        if (filters.isActive !== undefined) {
            query.isActive = filters.isActive;
        }
        const pipeline = [
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
                    from: packageCostModel_1.default.collection.name,
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
        return await packageModel_1.default.aggregate(pipeline);
    }
    /*
    async findPackagesById(id: string): Promise<IPackage | null> {
      return await packageModel.findOne({ _id: id, isDeleted: false }).lean();
    }
  */
    async findPackageWithCostsById(packageId) {
        return await packageModel_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(packageId),
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
                    from: packageCostModel_1.default.collection.name,
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
exports.PackageRepo = PackageRepo;
const savePackage = async (data) => {
    const user = await packageModel_1.default.create(data);
    return { _id: user._id };
};
exports.savePackage = savePackage;
const checkPackageExists = async (id) => {
    const result = await packageModel_1.default.findOne({
        _id: (0, objectIdParser_1.ObjectID)(id),
    });
    return !!result;
};
exports.checkPackageExists = checkPackageExists;
const updatePackage = async (packageId, data) => {
    const updatedRes = await packageModel_1.default.findByIdAndUpdate(packageId, data, { new: true });
    if (!updatedRes) {
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return { _id: updatedRes._id };
};
exports.updatePackage = updatePackage;
const deletePackage = async (id, options = {}) => {
    const result = await packageModel_1.default.findOneAndUpdate({ _id: (0, objectIdParser_1.ObjectID)(id) }, { isDeleted: true, modifiedOn: new Date().toISOString() }, { new: true, session: options.session });
    if (!result) {
        throw new appError_1.default('No document found with the Id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.deletePackage = deletePackage;
