import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../../models/user.model';

interface JwtPayloadWithUser extends JwtPayload {
  data: {
    user_id: string;
    email: string;
    password: string;
    phone: string;
    verification_code: string | null;
    expiry_time: string | null;
  };
}


/**
 * Generate JWT token
 * @param payload the data to be encoded in the token
 * @param expiresIn the expiration time of the token
 * @returns The generated token
 */
export const generateJwtToken = (payload: any, expiresIn: string): string | boolean => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
  } catch (error) {
    return false;
  }
};

/**
 * Verify JWT token
 * @param token the token to be verified
 * @returns The decoded token
 */
export const verifyJwtToken = async(token: string): Promise<string | boolean | JwtPayloadWithUser> => {
  try {
    if (token !== '') {
      const payload = await jwt.verify(token.split(' ')[1], process.env.JWT_SECRET) as JwtPayloadWithUser;
      return payload as JwtPayloadWithUser;
    }
    return false;
  } catch (error) {
    return false;
  }
}
