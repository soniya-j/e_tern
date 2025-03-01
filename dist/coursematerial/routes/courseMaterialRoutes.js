"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseMaterialController_1 = require("../controllers/courseMaterialController");
const authentication_1 = require("../../middleware/authentication");
const courseMaterialRequest_1 = require("../requests/courseMaterialRequest");
const router = (0, express_1.Router)();
router.get('/all', authentication_1.authenticateAdmin, courseMaterialController_1.getCourseMaterials);
router.get('/by-subcategory/:subCategoryId/:type/:studentId', authentication_1.authenticateUser, courseMaterialRequest_1.getCourseMaterialBySubCategoryIdValidation, courseMaterialController_1.getCourseMaterialsBySubCategoryId);
router.post('/track-view', authentication_1.authenticateUser, courseMaterialRequest_1.trackCourseMaterialValidation, courseMaterialController_1.trackCourseMaterialView);
router.post('/add-watch-history', authentication_1.authenticateUser, courseMaterialRequest_1.courseMaterialWatchHistoryValidation, courseMaterialController_1.createCourseMaterialWatchHistory);
router.post('/', authentication_1.authenticateAdmin, courseMaterialRequest_1.courseMaterialCreateValidation, courseMaterialController_1.createCourseMaterial);
router.put('/:id', authentication_1.authenticateAdmin, courseMaterialRequest_1.courseMaterialUpdateValidation, courseMaterialRequest_1.courseMaterialCreateValidation, courseMaterialController_1.updateCourseMaterial);
router.delete('/:id', authentication_1.authenticateAdmin, courseMaterialRequest_1.courseMaterialUpdateValidation, courseMaterialController_1.deleteCourseMaterial);
router.get('/videoDetails', authentication_1.authenticateAdmin, courseMaterialController_1.getVideoDetails);
router.get('/dashboard/trendingVideoDetails', authentication_1.authenticateAdmin, courseMaterialController_1.getTrendingVideoDetails);
router.get('/:id', authentication_1.authenticateAdmin, courseMaterialRequest_1.courseMaterialUpdateValidation, courseMaterialController_1.getCourseMaterialsById);
exports.default = router;
