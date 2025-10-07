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
