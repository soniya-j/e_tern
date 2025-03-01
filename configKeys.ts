import 'dotenv/config';
import path from 'path';

const configKeys = {
  DATABASE_URL: process.env.DATABASE as string,
  PORT: process.env.PORT as unknown as number,
  JWT_SECRET: process.env.JWT_SECRET as string,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID as string,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN as string,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER as string,
  BASE_DIR_PATH: path.join(__dirname),
  BREVO_API_KEY: process.env.BREVO_API_KEY as string,
};

export default configKeys;
