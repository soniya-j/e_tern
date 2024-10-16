"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageCostRepo = void 0;
const packageCostModel_1 = __importDefault(require("../models/packageCostModel"));
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
