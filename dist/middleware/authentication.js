"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = exports.authenticateUser = void 0;
const authentication_1 = require("../authentication/authentication");
const appError_1 = __importDefault(require("../common/appError"));
const httpStatus_1 = require("../common/httpStatus");
const localization_1 = require("../config/localization");
const logger_1 = __importDefault(require("../config/logger"));
function authenticateUser(req, res, next) {
    // Check for JWT token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const user = (0, authentication_1.verifyToken)(token);
            if (!user || typeof user === 'string' || user?.role !== 'user') {
                throw new appError_1.default(localization_1.responseMessages.invalid_token, httpStatus_1.HttpStatus.UNAUTHORIZED);
            }
            // Store user data in res.locals for use in other middleware and routes
            res.locals.userId = user.userId;
            next();
            return;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new appError_1.default(localization_1.responseMessages.unauthorized_user, httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
    }
    // If no JWT token is provided
    throw new appError_1.default(localization_1.responseMessages.jwt_token_required, httpStatus_1.HttpStatus.UNAUTHORIZED);
}
exports.authenticateUser = authenticateUser;
function authenticateAdmin(req, res, next) {
    // Check for JWT token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const user = (0, authentication_1.verifyToken)(token);
            if (!user || typeof user === 'string' || user?.role !== 'admin') {
                throw new appError_1.default(localization_1.responseMessages.invalid_token, httpStatus_1.HttpStatus.UNAUTHORIZED);
            }
            // Store user data in res.locals for use in other middleware and routes
            res.locals.userId = user.userId;
            next();
            return;
        }
        catch (error) {
            logger_1.default.error(error);
            throw new appError_1.default(localization_1.responseMessages.unauthorized_user, httpStatus_1.HttpStatus.UNAUTHORIZED);
        }
    }
    // If no JWT token is provided
    throw new appError_1.default(localization_1.responseMessages.jwt_token_required, httpStatus_1.HttpStatus.UNAUTHORIZED);
}
exports.authenticateAdmin = authenticateAdmin;
