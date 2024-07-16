/* eslint-disable @typescript-eslint/explicit-function-return-type */
import twilio from 'twilio';
import { otpGenerator } from '../libs/keyGenerator'

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const createOtp = async() => {
  const code = otpGenerator(4);

  const newDate = new Date();
  newDate.setTime(newDate.getTime() + 60 * 30 * 1000); // 30 minutes from now

  const expiry = newDate.toLocaleString();

  return { code, expiry };
}

export const sendVerificationCode = async(
  code: number,
  toPhoneNumber: string
) => {
  const response = await client.messages.create({
    body: `Your verification code is ${code} it will expire within 30 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: toPhoneNumber.trim(),
  });
  console.log(response);
  return response;
};
