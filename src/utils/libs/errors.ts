import { ValidationError, validate } from 'class-validator';

export const AppValidation = async(input: any): Promise<ValidationError[] | any> => {
  const error = await validate(input, {
    validationError: { target: false }
  });

  if (error.length > 0) {
    return error; 
  }

  return false;
};
