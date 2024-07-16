import bcrypt from 'bcryptjs';

/**
 * Bcrypt helper to hash password
 * @param password password to be hashed
 * @returns The hashed password
 */
export const hashPassword = async(password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

/**
 * Bcrypt helper to compare password
 * @param password password to be compared
 * @param hashPassword hashed password
 * @returns A boolean
 */
export const comparePassword = async(password: string, hashPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashPassword);
};
