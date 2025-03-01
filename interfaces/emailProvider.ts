// interfaces/emailProvider.ts
export interface EmailProvider {
  sendEmail(
    to: string,
    subject: string,
    textContent: string,
    htmlContent?: string,
    sender?: { email: string; name?: string },
  ): Promise<void>;
}
