"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
        this.isOperational = true;
    }
}
exports.default = AppError;
