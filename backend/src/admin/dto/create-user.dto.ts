import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
} from 'class-validator';

// CreateUserDto is used to validate the data when creating a new user from the admin panel.
// It ensures the email and password are valid, the role is one of the allowed values,
// and candidate/recruiter data are optional objects if provided.
export class CreateUserDto {
  @IsEmail() // Must be a valid email address
  email: string;

  @IsString() // Must be a string
  password: string;

  // Role must be one of: 'candidate', 'recruiter', or 'admin'
  @IsEnum(['candidate', 'recruiter', 'admin'])
  role: 'candidate' | 'recruiter' | 'admin';

  // Optional: Additional data for candidate users
  @IsOptional()
  @IsObject()
  candidateData?: any;

  // Optional: Additional data for recruiter users
  @IsOptional()
  @IsObject()
  recruiterData?: any;
}
