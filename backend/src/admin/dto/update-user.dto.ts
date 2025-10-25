import { IsEmail, IsString, IsOptional, IsObject } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsObject()
  candidateData?: any;

  @IsOptional()
  @IsObject()
  recruiterData?: any;
}
