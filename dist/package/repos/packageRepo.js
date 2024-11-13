"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePackage = exports.checkPackageExists = exports.savePackage = exports.PackageRepo = void 0;
const packageModel_1 = __importDefault(require("../models/packageModel"));
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
class PackageRepo {
    async findAllPackages() {
        return await packageModel_1.default.find({ isActive: true, isDeleted: false }).sort({ createdAt: -1 });
    }
}
exports.PackageRepo = PackageRepo;
const savePackage = async (data) => {
    const user = await packageModel_1.default.create(data);
    return { _id: user._id };
};
exports.savePackage = savePackage;
const checkPackageExists = async (id) => {
    const result = await packageModel_1.default.findById(id);
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
