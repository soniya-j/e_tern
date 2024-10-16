"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const packageController_1 = require("../controllers/packageController");
//import { authenticateUser } from '../../middleware/authentication';
const router = (0, express_1.Router)();
//router.get('/all', authenticateUser, getAllPackages);
router.get('/all', packageController_1.getAllPackages);
exports.default = router;
