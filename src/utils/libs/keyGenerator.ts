/* eslint-disable @typescript-eslint/no-inferrable-types */
import { randomBytes } from 'crypto';

export const otpGenerator = (length: number = 4): string => String(Math.ceil(Math.random() * 10 ** length)).padEnd(length, '0');
