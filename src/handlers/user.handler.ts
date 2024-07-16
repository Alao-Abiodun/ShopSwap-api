import { container } from 'tsyringe';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { UserService } from '../services/user.services';
import { errorResponse } from '../utils/libs/response';
import { StatusCodes } from 'http-status-codes';

const userService = container.resolve(UserService);

export const Signup = async(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  return await userService.create(event);
};

export const Login = async(event: APIGatewayProxyEventV2): Promise<any> => {
  return userService.login(event);
};

export const Verify = async(event: APIGatewayProxyEventV2): Promise<any> => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  switch (httpMethod) {
    case 'post':
      return userService.verifyUser(event);
    case 'get': 
      return userService.getVerificationToken(event);
    default:
      return userService.responseWithError(event);
  }
};

export const Profile = async(event: APIGatewayProxyEventV2): Promise<any> => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  switch (httpMethod) {
    case 'get':
      return userService.getProfile(event);
    case 'put':
      return userService.updateProfile(event);
    case 'post':
      return userService.createProfile(event);
    default:
      return errorResponse(404, 'Method not allowed');
  }
};

export const Cart = async(event: APIGatewayProxyEventV2): Promise<any> => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  switch (httpMethod) {
    case 'get':
      return userService.getCart(event);
    case 'post':
      return userService.addToCart(event);
    case 'delete':
      return userService.removeFromCart(event);
    default:
      return errorResponse(404, 'Method not allowed');
  }
}

export const Payment = async(event: APIGatewayProxyEventV2): Promise<any> => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  switch (httpMethod) {
    case 'post':
      return userService.makePayment(event);
    default:
      return errorResponse(404, 'Method not allowed');
  }
}

// export const handler = middy().use(httpHeaderNormalizer()).use(httpJsonBodyParser()).handler(Signup);
// export const Signup = middy(signupHandler).use(jsonBodyParser());
