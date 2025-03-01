"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackageCosts = exports.savePackageCosts = exports.packageCostDetail = exports.deletePackageCost = exports.PackageCostRepo = void 0;
const packageCostModel_1 = __importDefault(require("../models/packageCostModel"));
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const objectIdParser_1 = require("../../utils/objectIdParser");
class PackageCostRepo {
    async findAllPackageCosts() {
        return await packageCostModel_1.default
            .find({ isActive: true, isDeleted: false })
            .sort({ createdAt: -1 });
    }
    async findPackageCostsByPackageId(packageId) {
        return await packageCostModel_1.default
            .find({ packageId, isActive: true, isDeleted: false })
            .sort({ createdAt: -1 });
    }
}
exports.PackageCostRepo = PackageCostRepo;
const deletePackageCost = async (packageId, options = {}) => {
    const result = await packageCostModel_1.default.updateMany({ packageId }, { isDeleted: true, modifiedOn: new Date().toISOString() }, { new: true, session: options.session });
    if (!result) {
        throw new appError_1.default('No document found with the Id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.deletePackageCost = deletePackageCost;
const packageCostDetail = async (packageId, id) => {
    const result = await packageCostModel_1.default
        .findOne({
        _id: (0, objectIdParser_1.ObjectID)(id),
        packageId,
    }, {
        price: 1,
        validity: 1,
    })
        .lean();
    return result;
};
exports.packageCostDetail = packageCostDetail;
const savePackageCosts = async (packageId, costs) => {
    const packageCosts = costs.map((cost) => ({ ...cost, packageId }));
    await packageCostModel_1.default.insertMany(packageCosts);
};
exports.savePackageCosts = savePackageCosts;
const updatePackageCosts = async (packageId, packageCosts) => {
    await packageCostModel_1.default.findByIdAndUpdate(packageId, { $set: { packageCosts } }, { new: true });
};
exports.updatePackageCosts = updatePackageCosts;
