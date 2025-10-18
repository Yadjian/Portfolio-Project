import * as SecureStore from 'expo-secure-store';
import { getApiUrl } from '@/lib/types';
import { jwtDecode } from 'jwt-decode';

const API_URL = getApiUrl();

// Helper pour gérer les réponses de l'API et les erreurs
async function handleResponse(response: Response) {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    // Si le parsing échoue, on log le texte brut et on lève une erreur claire.
    console.error("La réponse du serveur n'est pas un JSON valide:", text);
    throw new Error(`Erreur HTTP ${response.status}: Réponse non-JSON du serveur.`);
  }

  if (!response.ok) {
    // En cas d'erreur, on log la réponse brute pour avoir plus de contexte.
    console.error("Réponse d'erreur brute du serveur:", text);
    throw new Error(data.message || `Erreur HTTP ${response.status}`);
  }
  return data;
}

// Helper pour créer les headers, avec ou sans token d'authentification
async function getHeaders(authenticated = false) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  if (authenticated) {
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
}

// ----------------------
// AUTHENTIFICATION
// ----------------------
export async function register(email: string, password: string, role: 'CANDIDATE' | 'RECRUITER') {
  // Cette route n'était pas dans les fichiers, mais est nécessaire pour CreateAccountScreen
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ email, password, role }),
  });
  const data = await handleResponse(response);

  await SecureStore.setItemAsync('auth_token', data.accessToken);
  await SecureStore.setItemAsync('refresh_token', data.refreshToken);

  const decodedToken: { sub: string } = jwtDecode(data.accessToken);
  const userId = decodedToken.sub;

  if (!userId) {
    throw new Error("L'ID de l'utilisateur n'a pas été reçu après l'inscription.");
  }

  return { ...data, userId };
}

export async function login(email: string, password: string) {
  // Cette route n'était pas dans les fichiers, mais est nécessaire pour LoginScreen
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: await getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);

  await SecureStore.setItemAsync('auth_token', data.accessToken);
  await SecureStore.setItemAsync('refresh_token', data.refreshToken);

  return data;
}

// ----------------------
// PROFIL & SWIPE
// ----------------------
export async function getMyProfile() {
  // Route nécessaire pour LoginScreen, CandidateProfileScreen, RecruiterProfileScreen
  const response = await fetch(`${API_URL}/profile/me`, {
    headers: await getHeaders(true),
  });
  return handleResponse(response);
}

export async function fetchProfile(userId: string, userType: 'candidate' | 'recruiter') {
  // Route extraite de EditProfileScreen.tsx
  const endpoint = userType === 'candidate'
    ? `${API_URL}/api/profiles/candidate/${userId}`
    : `${API_URL}/api/profiles/recruiter/${userId}`;

  const response = await fetch(endpoint, {
    headers: await getHeaders(true),
  });

  if (response.status === 404) return null;
  return handleResponse(response);
}

export async function updateProfile(userId: string, userType: 'candidate' | 'recruiter', profileData: any) {
  // Route extraite de EditProfileScreen.tsx
  const endpoint = userType === 'candidate'
    ? `${API_URL}/api/profiles/candidate/${userId}`
    : `${API_URL}/api/profiles/recruiter/${userId}`;

  const response = await fetch(endpoint, {
    method: 'PATCH',
    headers: await getHeaders(true),
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
}

export async function getProfilesToSwipe() {
  // Route pour SwipeNotificationScreen.tsx (basée sur la logique des profils)
  const response = await fetch(`${API_URL}/api/profiles/swipe`, {
    headers: await getHeaders(true),
  });
  return handleResponse(response);
}

// ----------------------
// ENTREPRISE
// ----------------------
export async function createCompany(data: { companyName: string; siret: string }) {
  // Route extraite de la version originale de ce fichier
  const response = await fetch(`${API_URL}/companies/onboarding`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function joinCompany(data: { siret: string }) {
  // Route extraite de la version originale de ce fichier
  const response = await fetch(`${API_URL}/onboarding/recruiter/join-company`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// ----------------------
// UTILITAIRES
// ----------------------
export async function checkBackendHealth() {
  // Route extraite de HomeScreen.tsx
  const response = await fetch(`${API_URL}/health`, {
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

export async function sendLocationToBackend(coords: { latitude: number; longitude: number }) {
  console.log('Coordonnées envoyées :', coords);
}

export async function getGoogleGeolocation(latitude: number, longitude: number) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
  );
  return handleResponse(response);
}
