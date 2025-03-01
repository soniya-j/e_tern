"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentgatewayRepo = void 0;
const paymentgatewayModel_1 = __importDefault(require("../models/paymentgatewayModel"));
class PaymentgatewayRepo {
    async findPaymentgatewayByName(paymentGatewayName) {
        return await paymentgatewayModel_1.default
            .findOne({ paymentGatewayName, isActive: true, isDeleted: false })
            .select({ _id: 1 })
            .lean();
    }
}
exports.PaymentgatewayRepo = PaymentgatewayRepo;
