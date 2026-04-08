import { IsEmail, IsString, IsOptional, IsObject } from 'class-validator';

// UpdateUserDto is used to validate the data when updating an existing user from the admin panel.
// All fields are optional, allowing partial updates.
// It ensures the email is valid if provided, the password is a string if provided,
// and candidate/recruiter data are optional objects if provided.
export class UpdateUserDto {
  @IsOptional() // Field is optional for partial updates
  @IsEmail() // Must be a valid email address if provided
  email?: string;

  @IsOptional() // Field is optional for partial updates
  @IsString() // Must be a string if provided
  password?: string;

  @IsOptional() // Field is optional for partial updates
  @IsObject() // Must be an object if provided
  candidateData?: any;

  @IsOptional() // Field is optional for partial updates
  @IsObject() // Must be an object if provided
  recruiterData?: any;
}
