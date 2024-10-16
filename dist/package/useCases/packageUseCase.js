"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPackagesUseCase = void 0;
const appError_1 = __importDefault(require("../../common/appError"));
const httpStatus_1 = require("../../common/httpStatus");
const packageRepo_1 = require("../repos/packageRepo");
const getAllPackagesUseCase = async () => {
    const packageRepo = new packageRepo_1.PackageRepo();
    const result = await packageRepo.findAllPackages();
    if (!result)
        throw new appError_1.default('No data found', httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
    return result;
};
exports.getAllPackagesUseCase = getAllPackagesUseCase;
