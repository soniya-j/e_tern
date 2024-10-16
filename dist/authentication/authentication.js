"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configKeys_1 = __importDefault(require("../configKeys"));
function generateToken(payload) {
    const token = jsonwebtoken_1.default.sign(payload, configKeys_1.default.JWT_SECRET, {
        expiresIn: '2d',
    });
    return token;
}
exports.generateToken = generateToken;
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, configKeys_1.default.JWT_SECRET);
}
exports.verifyToken = verifyToken;
