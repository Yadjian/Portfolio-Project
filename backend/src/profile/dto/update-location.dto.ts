import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateLocationDto {
  @IsString({ message: 'Le nom de lieu doit être une chaîne de caractères' })
  @IsNotEmpty({ message: 'Le nom de lieu est obligatoire' })
  @MaxLength(255, {
    message: 'Le nom de lieu est trop long (max 255 caractères)',
  })
  @Transform(({ value }) => value?.trim())
  locationName: string;

  @IsString({
    message: 'Les coordonnées doivent être une chaîne de caractères',
  })
  @IsNotEmpty({ message: 'Les coordonnées sont obligatoires' })
  @MaxLength(500, {
    message: 'Les coordonnées sont trop longues (max 500 caractères)',
  })
  @ValidateIf((o) => o.locationWKT && o.locationWKT.length > 0) // ✅ Validation conditionnelle
  @Matches(/^POINT\s*\(\s*-?\d+\.?\d*\s+-?\d+\.?\d*\s*\)$/i, {
    message: 'Format de coordonnées invalide. Exemple: POINT(2.3522 48.8566)',
  })
  locationWKT: string;
}
