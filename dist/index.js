"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./user/routes/userRoutes"));
const packageRoutes_1 = __importDefault(require("./package/routes/packageRoutes"));
const categoryRoutes_1 = __importDefault(require("./category/routes/categoryRoutes"));
const subCategoryRoutes_1 = __importDefault(require("./subcategory/routes/subCategoryRoutes"));
const logger_1 = __importDefault(require("./config/logger"));
const connectToDatabase_1 = __importDefault(require("./config/connectToDatabase"));
const errorHandleMiddleware_1 = __importDefault(require("./middleware/errorHandleMiddleware"));
const configKeys_1 = __importDefault(require("./configKeys"));
const swaggerConfig_1 = __importDefault(require("./swaggerdocs/swaggerConfig"));
const app = (0, express_1.default)();
(0, connectToDatabase_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/user', userRoutes_1.default);
app.use('/api/package', packageRoutes_1.default);
app.use('/api/category', categoryRoutes_1.default);
app.use('/api/subcategory', subCategoryRoutes_1.default);
app.use(errorHandleMiddleware_1.default);
const port = configKeys_1.default.PORT;
app.listen(port, () => {
    logger_1.default.info(`application is running at port ${port}`);
    (0, swaggerConfig_1.default)(app, port);
});
