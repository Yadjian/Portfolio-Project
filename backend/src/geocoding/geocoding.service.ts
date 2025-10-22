// src/geocoding/geocoding.service.ts
import { Injectable } from '@nestjs/common';
import { Client, GeocodeResult } from '@googlemaps/google-maps-services-js';

@Injectable()
export class GeocodingService {
  private googleMapsClient: Client;

  constructor() {
    this.googleMapsClient = new Client({});
  }

  async geocode(address: string) {
    try {
      console.log('Using API Key:', process.env.GOOGLE_MAPS_API_KEY);
      const response = await this.googleMapsClient.geocode({
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      });

      if (response.data.status !== 'OK' || !response.data.results[0]) {
        throw new Error('Adresse non trouvée ou invalide');
      }

      return this.formatGoogleResponse(response.data.results[0]);
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      throw new Error('Impossible de géocoder l\'adresse');
    }
  }

  /**
   * Met en forme la réponse complexe de Google
   * en notre objet de BDD simple.
   */
  private formatGoogleResponse(result: GeocodeResult) {
    const components = result.address_components;
    
    const get = (type: string) => 
        components.find(c => c.types.some(t => t === type))?.long_name || null;

    const lat = result.geometry.location.lat;
    const lng = result.geometry.location.lng;

    return {
      locationWKT: `POINT(${lat} ${lng})`,
      address: `${get('street_number') || ''} ${get('route') || ''}`.trim(),
      city: get('locality') || get('postal_town'),
      postalCode: get('postal_code'),
      country: get('country'),
    };
  }
}
