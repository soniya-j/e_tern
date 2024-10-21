"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAllActivities = void 0;
const activityModel_1 = __importDefault(require("../models/activityModel"));
const fetchAllActivities = async () => {
    return await activityModel_1.default
        .find({ isDeleted: false })
        .select({ _id: 1, title: 1, shortDescription: 1, category: 1 })
        .lean();
};
exports.fetchAllActivities = fetchAllActivities;
