// This DTO is used to validate and transfer location update data for a user profile.

import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateLocationDto {
  @IsString() // Must be a string
  @IsNotEmpty() // Location name cannot be empty
  locationName: string;

  @IsString() // Must be a string
  @IsNotEmpty() // Location WKT (Well-Known Text) cannot be empty
  locationWKT: string;
}
