"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../config/logger"));
const errorHandleMiddleware = (err, req, res, next) => {
    logger_1.default.error(err);
    err.statusCode = err.statusCode || 500;
    if (err.statusCode === 404) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
        });
    }
    else {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
        });
    }
    next();
};
exports.default = errorHandleMiddleware;
