"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageRepo = void 0;
//import { IPackageBody } from '../../types/package/packageTypes';
//import { ObjectID } from '../../utils/objectIdParser';
const packageModel_1 = __importDefault(require("../models/packageModel"));
class PackageRepo {
    async findAllPackages() {
        return await packageModel_1.default.find({ isActive: true, isDeleted: false }).sort({ createdAt: -1 });
    }
}
exports.PackageRepo = PackageRepo;
