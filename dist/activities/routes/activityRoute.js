"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_1 = require("../../middleware/authentication");
const activityController_1 = require("../controllers/activityController");
const router = (0, express_1.Router)();
router.get('/all', authentication_1.authenticateUser, activityController_1.getAllActivities);
exports.default = router;
