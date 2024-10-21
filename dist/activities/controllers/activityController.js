"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllActivities = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const localization_1 = require("../../config/localization");
const activityUseCase_1 = require("../useCases/activityUseCase");
exports.getAllActivities = (0, express_async_handler_1.default)(async (req, res) => {
    const activities = await (0, activityUseCase_1.getAllActivitiesUseCase)();
    res.status(200).json({
        success: true,
        message: localization_1.responseMessages.response_success_get,
        result: activities,
    });
});
