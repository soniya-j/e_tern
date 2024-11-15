"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("../../middleware/multer"));
const authentication_1 = require("../../middleware/authentication");
const userRequest_1 = require("../requests/userRequest");
const router = (0, express_1.Router)();
router.post('/register', userRequest_1.userRegisterValidation, userController_1.registerUser);
router.post('/verify-otp', userRequest_1.verifyOtpValidation, userController_1.verifyOtp);
router.post('/upload-avatar', authentication_1.authenticateUser, multer_1.default, userController_1.uploadAvatar);
router.post('/send-otp', userRequest_1.sendOtpValidation, userController_1.sendOtp);
router.get('/profile/:userId', authentication_1.authenticateUser, userRequest_1.getProfileValidation, userController_1.getProfile);
router.get('/coursematerial-track/:userId', authentication_1.authenticateUser, userRequest_1.courseMaterialTrackValidation, userController_1.courseMaterialTrack);
router.put('/profile-update/:userId', authentication_1.authenticateUser, userRequest_1.userUpdateValidation, userController_1.updateProfile);
router.post('/parentdob-update/:userId', authentication_1.authenticateUser, userRequest_1.userDobValidation, userController_1.updateParentDob);
router.post('/parentdob-verify', authentication_1.authenticateUser, userRequest_1.userDobVerifyValidation, userController_1.verifyParentDob);
router.get('/switch-student/:studentId', authentication_1.authenticateUser, userRequest_1.switchStudentValidation, userController_1.switchStudent);
//Admin apis
// GET /api/user/all?fullName=Juan&subscribed=true&status=1&limit=5&page=2 //all optional
router.post('/login', userRequest_1.loginValidation, userController_1.login);
router.get('/all', authentication_1.authenticateAdmin, userController_1.getUsers);
router.post('/register-admin', userRequest_1.adminRegisterValidation, userController_1.registerAdmin);
exports.default = router;
