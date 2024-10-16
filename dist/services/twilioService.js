"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
const twilio_1 = __importDefault(require("twilio"));
const configKeys_1 = __importDefault(require("../configKeys"));
const client = (0, twilio_1.default)(configKeys_1.default.TWILIO_ACCOUNT_SID, configKeys_1.default.TWILIO_AUTH_TOKEN);
const sendOtp = async (to, otp) => {
    await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: configKeys_1.default.TWILIO_PHONE_NUMBER,
        to: `+91${to}`,
    });
};
exports.sendOtp = sendOtp;
