"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./user/routes/userRoutes"));
const activityRoute_1 = __importDefault(require("./activities/routes/activityRoute"));
const packageRoutes_1 = __importDefault(require("./package/routes/packageRoutes"));
const categoryRoutes_1 = __importDefault(require("./category/routes/categoryRoutes"));
const subCategoryRoutes_1 = __importDefault(require("./subcategory/routes/subCategoryRoutes"));
const packageCostRoutes_1 = __importDefault(require("./packagecost/routes/packageCostRoutes"));
const courseMaterialRoutes_1 = __importDefault(require("./coursematerial/routes/courseMaterialRoutes"));
const studentRoutes_1 = __importDefault(require("./student/routes/studentRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./subscription/routes/subscriptionRoutes"));
const logger_1 = __importDefault(require("./config/logger"));
const connectToDatabase_1 = __importDefault(require("./config/connectToDatabase"));
const errorHandleMiddleware_1 = __importDefault(require("./middleware/errorHandleMiddleware"));
const configKeys_1 = __importDefault(require("./configKeys"));
const swaggerConfig_1 = __importDefault(require("./swaggerdocs/swaggerConfig"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
(0, connectToDatabase_1.default)();
//Newly added
// Serve the upload folder statically
app.use('/upload', express_1.default.static(path_1.default.join(__dirname, 'upload')));
app.use('/upload', express_1.default.static(path_1.default.join(__dirname, 'upload')));
dotenv_1.default.config();
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
// Dynamic CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
//end
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/user', userRoutes_1.default);
app.use('/api/activity', activityRoute_1.default);
app.use('/api/package', packageRoutes_1.default);
app.use('/api/category', categoryRoutes_1.default);
app.use('/api/subcategory', subCategoryRoutes_1.default);
app.use('/api/packagecost', packageCostRoutes_1.default);
app.use('/api/coursematerial', courseMaterialRoutes_1.default);
app.use('/api/student', studentRoutes_1.default);
app.use('/api/subscription', subscriptionRoutes_1.default);
app.use(errorHandleMiddleware_1.default);
const port = configKeys_1.default.PORT;
app.listen(port, () => {
    logger_1.default.info(`application is running at port ${port}`);
    (0, swaggerConfig_1.default)(app, port);
});
