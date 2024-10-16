"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPackages = void 0;
const packageUseCase_1 = require("../useCases/packageUseCase");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const localization_1 = require("../../config/localization");
//import { IPackageBody } from '../../types/package/packageModel';
exports.getAllPackages = (0, express_async_handler_1.default)(async (req, res) => {
    const result = await (0, packageUseCase_1.getAllPackagesUseCase)();
    res.status(201).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: result,
    });
});
