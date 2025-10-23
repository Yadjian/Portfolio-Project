// Fichier: backend/src/profile/dto/update-location.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateLocationDto {
  @IsString()
  @IsNotEmpty()
  locationName: string;

  @IsString()
  @IsNotEmpty()
  locationWKT: string;
}
