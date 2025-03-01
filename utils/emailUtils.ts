import fs from 'fs';
import path from 'path';

export const generateEmailContent = (mainContent: string, subject: string): string => {
  const templatePath = path.resolve(__dirname, 'emailTemplate.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  // Replace placeholders
  const logoUrl = 'https://example.com/logo.png'; // Replace with your logo URL
  return template
    .replace('{{logoUrl}}', logoUrl)
    .replace('{{subject}}', subject)
    .replace('{{mainContent}}', mainContent);
};
