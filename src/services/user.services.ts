/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '../utils/libs/response';
import { UserRepository } from '../repository/user.repository';
import { autoInjectable } from 'tsyringe';
import { plainToClass } from 'class-transformer';
import { SignUpInput } from '../models/dto/signupInput.dto';
import { AppValidation } from '../utils/libs/errors';
import { hashPassword, comparePassword } from '../utils/helpers/bcrypt.helper';
import { LoginInput } from '../models/dto/loginInput.dto';
import AppError from '../utils/libs/appError';
import { User } from '../models/user.model';
import { generateJwtToken, verifyJwtToken } from '../utils/helpers/jwt.helper';
import { createOtp, sendVerificationCode } from '../utils/helpers/createOtp.helper';
import { VerificationInput } from '../models/dto/verifyInput.dto';
import { timeDifference } from '../utils/helpers/date.helper';
import { ProfileInput } from '../models/dto/addressInput.dto';

    
@autoInjectable()
export class UserService {
  repository: UserRepository;
  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async responseWithError(event: APIGatewayProxyEventV2) {
    return errorResponse(404, 'Method not allowed');
  }

  async create(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    try {
      const body = event.body ? JSON.parse(event.body) : {};

      const input = plainToClass(SignUpInput, body);

      const error = await AppValidation(input);
      if (error) return errorResponse(404, error);

      const hashedPassword = await hashPassword(input.password);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        userType: 'BUYER',
      })

      return successResponse(data);
    } catch (error) {
      console.error('Error in create:', error);
      return errorResponse(500, error);
    }
  }

  async login(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
  
      const input = plainToClass(LoginInput, body);
  
      const error = await AppValidation(input);
      if (error) return errorResponse(404, error);

      const data: User = await this.repository.findAccount(input.email);

      // console.log('data:', data);

      // return;

      const isPasswordMatch = await comparePassword(input.password, data.password);
      if (!isPasswordMatch) {
        throw new Error('Invalid password');
      }
      const token = await generateJwtToken({data}, '1h');
  
      return successResponse({ token });
    } catch (error) {
      console.error('Error in create:', error);
      return errorResponse(500, error);
    }
  }

  async getVerificationToken(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    try {
      const token = event.headers.authorization;
      const payload = await verifyJwtToken(token);
      if (!payload || typeof payload === 'string' || typeof payload === 'boolean') {
        return errorResponse(401, 'Unauthorized failed');
      }

      const { code, expiry } = await createOtp();

      await this.repository.updateVerificationCode(Number(payload.data.user_id), String(code), expiry);

      // const response = await sendVerificationCode(Number(code), payload.data.phone);

      // console.log('response:', response);

      return successResponse({ message: 'Verification code sent successfully' });
    } catch (error) {
      console.error('Error in getVerificationToken:', error);
      return errorResponse(500, error);
    }
  }

  async verifyUser(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
    try {
      const token = event.headers.authorization;
      const payload = await verifyJwtToken(token);
      if (!payload || typeof payload === 'string' || typeof payload === 'boolean') {
        return errorResponse(401, 'Unauthorized failed');
      }

      const input = plainToClass(VerificationInput, JSON.parse(event.body));
      const error = await AppValidation(input);
      if (error) return errorResponse(404, error);

      const { verification_code: verificationCode, expiry_time: expiryTime } = await this.repository.findAccount(payload.data.email);

      if (verificationCode !== parseInt(input.code)) {
        return errorResponse(401, 'Invalid verification code');
      } else {
        const currentTime = new Date().getTime();
        const diff = timeDifference(expiryTime, currentTime, 'm');
        if (diff > 0) {
          await this.repository.updateVerifyUser(Number(payload.data.user_id));
        } else {
          return errorResponse(401, 'Verification code is expired');
        }
      }
      return successResponse({ message: 'User verified successfully' });
    } catch (error) {
      console.error('Error in verifyUser:', error);
      return errorResponse(500, error);
    }
  }

  async createProfile(event: APIGatewayProxyEventV2): Promise<any> {
    try {
      const token = event.headers.authorization;
      const payload = await verifyJwtToken(token);
      if (!payload || typeof payload === 'string' || typeof payload === 'boolean') {
        return errorResponse(401, 'Unauthorized failed');
      }

      const body = event.body ? JSON.parse(event.body) : {};
      const input = plainToClass(ProfileInput, body);

      const error = await AppValidation(input);
      if (error) return errorResponse(404, error);

      await this.repository.createProfile(Number(payload.data.user_id), input);
      return successResponse({message: 'Profile created successfully'});
    } catch (error) {
      console.error('Error in createProfile:', error);
      return errorResponse(500, error);
    }
  }

  async getProfile(event: APIGatewayProxyEventV2): Promise<any> {
    try {
      const token = event.headers.authorization;
      const payload = await verifyJwtToken(token);
      if (!payload || typeof payload === 'string' || typeof payload === 'boolean') {
        return errorResponse(401, 'Unauthorized failed');
      }

      const result = await this.repository.getProfile(Number(payload.data.user_id));

      return successResponse(result);
    } catch (error) {
      console.error('Error in getProfile:', error);
      return errorResponse(500, error);
    }
  }

  async updateProfile(event: APIGatewayProxyEventV2): Promise<any> {
    try {
      const token = event.headers.authorization;
      const payload = await verifyJwtToken(token);
      if (!payload || typeof payload === 'string' || typeof payload === 'boolean') {
        return errorResponse(401, 'Unauthorized failed');
      }
  
      const body = event.body ? JSON.parse(event.body) : {};
      const input = plainToClass(ProfileInput, body);
      
      const error = await AppValidation(input);
      if (error) return errorResponse(404, error);
  
      await this.repository.updateProfile(Number(payload.data.user_id), input);
      return successResponse({message: 'Profile updated successfully' }); 
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return errorResponse(500, error);
      
    }
  }

  async getCart(event: APIGatewayProxyEventV2): Promise<any> {
    return successResponse({});
  }

  async addToCart(event: APIGatewayProxyEventV2): Promise<any> {
    return successResponse({});
  }

  async removeFromCart(event: APIGatewayProxyEventV2): Promise<any> {
    return successResponse({});
  }

  async makePayment(event: APIGatewayProxyEventV2): Promise<any> {
    return successResponse({});
  }
}
