import twilio from 'twilio';
import configKeys from '../configKeys';

const client = twilio(configKeys.TWILIO_ACCOUNT_SID, configKeys.TWILIO_AUTH_TOKEN);

export const sendOtp = async (to: number, otp: string): Promise<void> => {
  await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: configKeys.TWILIO_PHONE_NUMBER,
    to: `+91${to}`,
  });
};
