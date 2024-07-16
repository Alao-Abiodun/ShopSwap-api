import { Length } from 'class-validator';

export class AddressInput {
  id?: number;

  @Length(3, 255)
  addressLine1: string;
  addressLine2: string;
    
  @Length(3, 255)
  city: string;
    
  @Length(3, 255)
  country: string;
    
  @Length(3, 255)
  postalCode: string;
}

export class ProfileInput {
  @Length(3, 255)
  firstName: string;
    
  @Length(3, 255)
  lastName: string;
    
  @Length(3, 255)
  userType: string;
    
  address: AddressInput;
}
