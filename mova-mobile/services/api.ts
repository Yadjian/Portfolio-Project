import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://localhost:8081/api'; // Mets l'URL de ton backend ici

export async function getCurrentUser() {
  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) throw new Error('Pas de token');

  const response = await fetch(`${API_BASE_URL}/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error('Erreur API');
  return await response.json();
}

export async function updateProfile(profileData: any) {
  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) throw new Error('Pas de token');

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) throw new Error('Erreur API');
  return await response.json();
}

export async function createCompany(data: { companyName: string; siret: string }) {
  const token = await SecureStore.getItemAsync('auth_token');
  const response = await fetch(`${API_BASE_URL}/onboarding/recruiter/create-company`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erreur création entreprise');
  return await response.json();
}

export async function joinCompany(data: { siret: string }) {
  const token = await SecureStore.getItemAsync('auth_token');
  const response = await fetch(`${API_BASE_URL}/onboarding/recruiter/join-company`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Erreur rejoindre entreprise');
  return await response.json();
}

// BACKEND: Fonction à compléter quand le backend sera prêt
export async function sendLocationToBackend(coords: { latitude: number; longitude: number }) {
  // BACKEND: Remplacer ce log par un vrai appel API
  console.log('Coordonnées envoyées :', coords);

  // BACKEND: Exemple d'appel API à activer plus tard
  // await fetch(`${API_BASE_URL}/location`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(coords),
  // });
}

export async function getGoogleGeolocation(latitude: number, longitude: number) {
  // Remplace 'YOUR_API_KEY' par ta vraie clé Google
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
  );
  return await response.json();
}
