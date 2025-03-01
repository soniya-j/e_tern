"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const authentication_1 = require("../../middleware/authentication");
const subscriptionRequest_1 = require("../requests/subscriptionRequest");
const multer_1 = __importDefault(require("../../middleware/multer"));
const router = (0, express_1.Router)();
router.post('/', authentication_1.authenticateUser, subscriptionRequest_1.subscriptionValidation, subscriptionController_1.subscription);
router.post('/add-offline-payment', authentication_1.authenticateAdmin, multer_1.default, subscriptionRequest_1.offlinePaymentValidation, subscriptionController_1.addOfflinePayment);
router.get('/offlinepayments', authentication_1.authenticateAdmin, subscriptionController_1.getOfflinePayments);
router.get('/revenueDetails', authentication_1.authenticateAdmin, subscriptionController_1.getRevenueDetails);
router.get('/:id', authentication_1.authenticateAdmin, subscriptionRequest_1.subscriptionIdValidation, subscriptionController_1.getSubscriptionById);
exports.default = router;
