// This file defines the AuthDto class used for user login data validation.

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

// AuthDto is used to validate the login request body.
// It ensures the email is valid and the password meets minimum requirements.
export class AuthDto {
  @IsEmail() // Must be a valid email address
  @IsNotEmpty() // Email field cannot be empty
  email: string;

  @IsString() // Must be a string
  @IsNotEmpty() // Password field cannot be empty
  @MinLength(6, { message: 'Le mot de passe doit faire au moins 6 caractères.' }) // Minimum password length is 6
  password: string;
}
