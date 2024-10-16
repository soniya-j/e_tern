"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageCostsByPackageIdUseCase = exports.getAllPackageCostsUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const packageCostRepo_1 = require("../repos/packageCostRepo");
const getAllPackageCostsUseCase = async () => {
    const packageCostRepo = new packageCostRepo_1.PackageCostRepo();
    const result = await packageCostRepo.findAllPackageCosts();
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.NOT_FOUND);
    return result;
};
exports.getAllPackageCostsUseCase = getAllPackageCostsUseCase;
const getPackageCostsByPackageIdUseCase = async (packageId) => {
    const packageCostRepo = new packageCostRepo_1.PackageCostRepo();
    const result = await packageCostRepo.findPackageCostsByPackageId(packageId);
    if (!result || result.length === 0) {
        throw new appError_1.default('No data found for the given package', httpStatus_1.HttpStatus.NOT_FOUND);
    }
    return result;
};
exports.getPackageCostsByPackageIdUseCase = getPackageCostsByPackageIdUseCase;
