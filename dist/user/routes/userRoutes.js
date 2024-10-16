"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const multer_1 = __importDefault(require("../../middleware/multer"));
const authentication_1 = require("../../middleware/authentication");
const router = (0, express_1.Router)();
router.post('/register', userController_1.registerUser);
router.post('/verify-otp', userController_1.verifyOtp);
router.post('/upload-avatar', authentication_1.authenticateUser, multer_1.default, userController_1.uploadAvatar);
exports.default = router;
