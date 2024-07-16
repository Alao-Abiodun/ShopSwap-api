import { Length } from 'class-validator';
import { LoginInput } from './loginInput.dto';

export class SignUpInput extends LoginInput {
  @Length(10, 15)
  phone: string;
}
