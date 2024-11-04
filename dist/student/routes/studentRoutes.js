"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const authentication_1 = require("../../middleware/authentication");
const studentRequest_1 = require("../requests/studentRequest");
const router = (0, express_1.Router)();
router.get('all/:userId', authentication_1.authenticateUser, studentRequest_1.getStudentsByUserIdValidation, studentController_1.getStudentsByUserId);
exports.default = router;
