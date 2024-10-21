"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllActivitiesUseCase = void 0;
const activityRepo_1 = require("../repos/activityRepo");
const getAllActivitiesUseCase = async () => {
    return await (0, activityRepo_1.fetchAllActivities)();
};
exports.getAllActivitiesUseCase = getAllActivitiesUseCase;
