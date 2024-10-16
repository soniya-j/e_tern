"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const configKeys_1 = __importDefault(require("../configKeys"));
const DB_URI = configKeys_1.default.DATABASE_URL;
const MAX_RETRY_ATTEMPTS = 20;
const RETRY_INTERVAL = 3000; // 3 seconds
let retryCount = 0;
function connectToDatabase() {
    mongoose_1.default.set('strictQuery', false);
    function connect() {
        mongoose_1.default
            .connect(DB_URI)
            .then(() => {
            logger_1.default.info('Database connected');
            retryCount = 0; // Reset retry count on successful connection
        })
            .catch((err) => {
            logger_1.default.error('Failed to connect to database:', err);
            if (retryCount < MAX_RETRY_ATTEMPTS) {
                logger_1.default.info(`Retrying connection... Attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS}`);
                retryCount++;
                setTimeout(connect, RETRY_INTERVAL);
            }
            else {
                logger_1.default.error(`Unable to connect after ${MAX_RETRY_ATTEMPTS} attempts. Stopping the application.`);
                process.exit(1);
            }
        });
    }
    connect(); // Initial connection attempt
}
exports.default = connectToDatabase;
