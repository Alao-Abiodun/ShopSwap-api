import { Address } from './address.model';

export interface User {
  user_id?: number;
  email: string;
  password: string;
  phone: string;
  userType: 'BUYER' | 'SELLER';
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  verification_code?: number;
  expiry_time?: number;
  is_verified?: boolean;
  address?: Address[];
}
