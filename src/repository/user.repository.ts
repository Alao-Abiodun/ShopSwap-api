/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '../models/user.model';
import { DBClient } from '../config/database.config';
import { ProfileInput } from '../models/dto/addressInput.dto';
import { Address } from '../models/address.model';
import { DBOperation } from '../utils/helpers/db.helper';

export class UserRepository extends DBOperation  {
  constructor() { 
    super();
  }

  async createAccount( { email, password, phone, userType }: User): Promise<User> {
    const client = await DBClient();
    await client.connect();
    const queryString = 'INSERT INTO users (email, password, phone, user_type) VALUES ($1, $2, $3, $4) RETURNING *;';
    const values = [email, password, phone, userType];
    const result = await client.query(queryString, values);
    await client.end();
    if (result.rowCount > 0) {
      return result.rows[0];
    }
  }

  async findAccount(email: string): Promise<User> {      
    const client = await DBClient();
    await client.connect();
    const queryString = 'SELECT user_id, email, password, phone, verification_code, expiry_time FROM users WHERE email = $1;';
    const values = [email];
    const result = await client.query(queryString, values);
    await client.end();
    if (result.rowCount < 1) {
      throw new Error('User Not Found');
    }
    return result.rows[0] as User;
  }

  async updateVerificationCode(userId: number, code: string, expiry: string): Promise<User> {
    const queryString = 'UPDATE users SET verification_code = $1, expiry_time = $2 WHERE user_id = $3 AND is_verified = FALSE RETURNING *;';
    const values = [code, expiry, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as User;
    }
    throw new Error('User already verified');
  }

  async updateVerifyUser(userId: number): Promise<User> {
    const client = await DBClient();
    await client.connect();
    const queryString = 'UPDATE users SET is_verified=TRUE WHERE user_id = $1 AND is_verified=FALSE RETURNING *;';
    const values = [userId];
    const result = await client.query(queryString, values);
    await client.end();
    if (result.rowCount > 0) {
      return result.rows[0] as User;
    }
    throw new Error('User already verified');
  }

  async updateUser(userId: number, firstName: string, lastName: string, userTye: string) {
    const client = await DBClient();
    await client.connect();
    const queryString = 'UPDATE users SET first_name = $1, last_name = $2, user_type = $3 WHERE user_id = $4 RETURNING *;';
    const values = [firstName, lastName, userTye, userId];
    const result = await client.query(queryString, values);
    await client.end();
    if (result.rowCount > 0) {
      return result.rows[0] as User;
    }
    throw new Error('Error while updating user');
  }

  async createProfile(userId: number, { firstName, lastName, userType, address: { addressLine1, addressLine2, city, postalCode, country } }: ProfileInput) {
    const updatedUser = await this.updateUser(userId, firstName, lastName, userType);

    const client = await DBClient();
    await client.connect();
    const queryString = 'INSERT INTO address (user_id, address_line1, address_line2, city, postal_code, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    const values = [userId, addressLine1, addressLine2, city, postalCode, country];
    const result = await client.query(queryString, values);
    await client.end();
    if (result.rowCount > 0) {
      result.rows[0] as User;
      return { updatedUser, result };
    }
    throw new Error('Error while creating profile');
  }

  async getProfile(userId: number): Promise<User> {
    const client = await DBClient();
    await client.connect();
    const queryString = 'SELECT first_name, last_name, email, phone, user_type, is_verified FROM users WHERE user_id = $1;';
    const values = [userId];
    const profileResult = await client.query(queryString, values);
    if (profileResult.rowCount < 1) {
      throw new Error('User not found');
    }

    const userProfile  = profileResult.rows[0] as User;

    const addressQueryString = 'SELECT address_line1, address_line2, city, postal_code, country FROM address WHERE user_id = $1;';
    const addressResult = await client.query(addressQueryString, values);
    await client.end();
    if (addressResult.rowCount > 0) {
      userProfile.address = addressResult.rows as Address[];
    }
    return userProfile;
  }

  async updateProfile(userId: number, { firstName, lastName, userType, address: { addressLine1, addressLine2, city, postalCode, country, id } }: ProfileInput) {
    const updatedUser = await this.updateUser(userId, firstName, lastName, userType);

    const client = await DBClient();
    await client.connect();
    const queryString = 'UPDATE address SET address_line1 = $1, address_line2 = $2, city = $3, postal_code = $4, country = $5 WHERE user_id = $6 RETURNING *;';
    const values = [addressLine1, addressLine2, city, postalCode, country, id];
    const result = await client.query(queryString, values);
    await client.end();
    if (result.rowCount < 1) {
      throw new Error('Error while updating profile');
    }
    return true;
  }
}
