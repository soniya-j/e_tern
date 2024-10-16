"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_1 = __importDefault(require("../config/logger"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E Tern API',
            version: '1.0.0',
            description: 'backend API for E Tern',
        },
    },
    apis: ['./swaggerdocs/*.yaml'],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function setupSwagger(app, port) {
    app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    logger_1.default.info(`Docs available at http://localhost:${port}/api/docs`);
}
exports.default = setupSwagger;
