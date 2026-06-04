import { IsLatitude, IsLongitude } from 'class-validator';

export class UpdateLiveLocationDto {
  @IsLatitude({ message: 'Latitude invalide.' })
  latitude: number;

  @IsLongitude({ message: 'Longitude invalide.' })
  longitude: number;
}
