"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrevoService = void 0;
const brevo_1 = require("@getbrevo/brevo");
const emailUtils_1 = require("../utils/emailUtils");
const configKeys_1 = __importDefault(require("../configKeys"));
// Initialize the TransactionalEmailsApi client
const brevoClient = new brevo_1.TransactionalEmailsApi();
brevoClient.setApiKey(brevo_1.TransactionalEmailsApiApiKeys.apiKey, configKeys_1.default.BREVO_API_KEY);
class BrevoService {
    async sendEmail(to, subject, textContent, htmlContent = '', sender = { email: 'admin@etern.adpedia.in', name: 'ETern' }) {
        try {
            // Generate email content using your template utility
            const emailHtml = (0, emailUtils_1.generateEmailContent)(htmlContent, subject);
            const emailData = {
                sender,
                to: [{ email: to }],
                subject,
                textContent,
                htmlContent: emailHtml,
            };
            // Use the Brevo client to send the email
            const response = await brevoClient.sendTransacEmail(emailData);
            console.log('Email sent successfully:', response);
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error sending email via Brevo:', error.message);
                throw new Error('Failed to send email');
            }
            else {
                console.error('Unknown error sending email:', error);
                throw new Error('An unknown error occurred while sending the email');
            }
        }
    }
}
exports.BrevoService = BrevoService;
