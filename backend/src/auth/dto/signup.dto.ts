// This file defines the SignupDto class used for user registration data validation.

import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn } from 'class-validator';

// Define possible user roles as an enum to avoid typos and ensure consistency
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  RECRUITER = 'RECRUITER',
}

// SignupDto is used to validate the signup request body.
// It ensures the email and password are valid and the role is one of the allowed values.
export class SignupDto {
  @IsEmail() // Must be a valid email address
  @IsNotEmpty() // Email field cannot be empty
  email: string;

  @IsString() // Must be a string
  @IsNotEmpty() // Password field cannot be empty
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères.' }) // Minimum password length is 6
  password: string;

  // The role chosen by the user; must be either 'CANDIDATE' or 'RECRUITER'
  @IsIn([UserRole.CANDIDATE, UserRole.RECRUITER]) // Only allow specific roles
  @IsNotEmpty() // Role field cannot be empty
  role: UserRole;
}
