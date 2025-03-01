"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmailContent = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateEmailContent = (mainContent, subject) => {
    const templatePath = path_1.default.resolve(__dirname, 'emailTemplate.html');
    const template = fs_1.default.readFileSync(templatePath, 'utf8');
    // Replace placeholders
    const logoUrl = 'https://example.com/logo.png'; // Replace with your logo URL
    return template
        .replace('{{logoUrl}}', logoUrl)
        .replace('{{subject}}', subject)
        .replace('{{mainContent}}', mainContent);
};
exports.generateEmailContent = generateEmailContent;
