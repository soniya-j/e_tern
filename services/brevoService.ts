import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';
import { EmailProvider } from '../interfaces/emailProvider';
import { generateEmailContent } from '../utils/emailUtils';
import configKeys from '../configKeys';

// Initialize the TransactionalEmailsApi client
const brevoClient = new TransactionalEmailsApi();
brevoClient.setApiKey(TransactionalEmailsApiApiKeys.apiKey, configKeys.BREVO_API_KEY);

export class BrevoService implements EmailProvider {
  async sendEmail(
    to: string,
    subject: string,
    textContent: string,
    htmlContent: string = '',
    sender = { email: 'admin@etern.adpedia.in', name: 'ETern' },
  ): Promise<void> {
    try {
      // Generate email content using your template utility
      const emailHtml = generateEmailContent(htmlContent, subject);

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
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error sending email via Brevo:', error.message);
        throw new Error('Failed to send email');
      } else {
        console.error('Unknown error sending email:', error);
        throw new Error('An unknown error occurred while sending the email');
      }
    }
  }
}
