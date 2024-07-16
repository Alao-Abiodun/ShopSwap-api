// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsEmail, Length } from 'class-validator';
export class LoginInput {
  @IsEmail()
  email: string; 
      
  @Length(6, 32)
  password: string;
}
