"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackagesByIdUseCase = exports.deletePackageUseCase = exports.updatePackageUseCase = exports.createPackageUseCase = exports.getAllPackagesAdminUseCase = exports.getAllPackagesUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const packageRepo_1 = require("../repos/packageRepo");
const studentRepo_1 = require("../../student/repos/studentRepo");
const mongoose_1 = require("mongoose");
const packageCostRepo_1 = require("../../packagecost/repos/packageCostRepo");
const packageCostRepo_2 = require("../../packagecost/repos/packageCostRepo");
const getAllPackagesUseCase = async () => {
    const packageRepo = new packageRepo_1.PackageRepo();
    //  const result = await packageRepo.findAllPackages();
    const result = await packageRepo.findAllPackagesWithCosts();
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    return result;
};
exports.getAllPackagesUseCase = getAllPackagesUseCase;
const getAllPackagesAdminUseCase = async (filters, limit, page) => {
    const packageRepo = new packageRepo_1.PackageRepo();
    const result = await packageRepo.findAllPackagesWithCostsAdmin(filters, limit, page);
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    return result;
};
exports.getAllPackagesAdminUseCase = getAllPackagesAdminUseCase;
/*
export const createPackageUseCase = async (data: IPackageBody): Promise<Pick<IPackage, '_id'>> => {
  const result = await savePackage(data);
  return result;
};
*/
const createPackageUseCase = async (data) => {
    const { packageCosts, ...packageData } = data;
    // Save package
    const { _id: packageId } = await (0, packageRepo_1.savePackage)(packageData);
    // Save package costs with the packageId reference
    if (packageCosts && packageCosts.length > 0) {
        await (0, packageCostRepo_2.savePackageCosts)(packageId, packageCosts);
    }
    return { packageId };
};
exports.createPackageUseCase = createPackageUseCase;
const updatePackageUseCase = async (packageId, data) => {
    const { packageCosts, ...packageDetails } = data;
    // Update package details
    const packageUpdateResult = await (0, packageRepo_1.updatePackage)(packageId, packageDetails);
    // update packageCosts
    const deletePackageCostResult = await (0, packageCostRepo_1.deletePackageCost)(packageId);
    if (!deletePackageCostResult) {
        throw new appError_1.default('Failed to delete package cost', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    if (packageCosts && packageCosts.length > 0) {
        await (0, packageCostRepo_2.savePackageCosts)(packageId, packageCosts);
    }
    return packageUpdateResult;
};
exports.updatePackageUseCase = updatePackageUseCase;
const deletePackageUseCase = async (packageId) => {
    const session = await (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const checkPackageIsSubscribed = await (0, studentRepo_1.packageIsSubscribed)(packageId);
        if (checkPackageIsSubscribed) {
            throw new appError_1.default('Deletion not allowed as this package is currently subscribed by a user.', httpStatus_1.HttpStatus.BAD_REQUEST);
        }
        const deletePackageResult = await (0, packageRepo_1.deletePackage)(packageId, { session });
        if (!deletePackageResult) {
            throw new appError_1.default('Failed to delete package', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const deletePackageCostResult = await (0, packageCostRepo_1.deletePackageCost)(packageId, { session });
        if (!deletePackageCostResult) {
            throw new appError_1.default('Failed to delete package cost', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        await session.commitTransaction();
        return true;
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
};
exports.deletePackageUseCase = deletePackageUseCase;
const getPackagesByIdUseCase = async (id) => {
    const packageRepo = new packageRepo_1.PackageRepo();
    const packageDetails = await packageRepo.findPackageWithCostsById(id);
    if (!packageDetails || packageDetails.length === 0) {
        throw new appError_1.default('No Packages found for the given id', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return packageDetails;
};
exports.getPackagesByIdUseCase = getPackagesByIdUseCase;
