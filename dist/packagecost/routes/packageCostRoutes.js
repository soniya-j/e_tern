"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const packageCostController_1 = require("../controllers/packageCostController");
//import { authenticateUser } from '../../middleware/authentication';
const packageCostRequest_1 = require("../requests/packageCostRequest");
const router = (0, express_1.Router)();
//router.get('/all', authenticateUser, getCategories);
router.get('/all', packageCostController_1.getPackageCosts);
router.get('/by-package/:packageId', packageCostRequest_1.getPackageCostByPackageIdValidation, packageCostController_1.getPackageCostsByPackageId);
exports.default = router;
