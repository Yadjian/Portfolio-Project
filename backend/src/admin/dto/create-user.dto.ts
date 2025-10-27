import { IsEmail, IsString, IsOptional, IsEnum, IsObject } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(['candidate', 'recruiter', 'admin'])
  role: 'candidate' | 'recruiter' | 'admin';

  @IsOptional()
  @IsObject()
  candidateData?: any;

  @IsOptional()
  @IsObject()
  recruiterData?: any;
}
