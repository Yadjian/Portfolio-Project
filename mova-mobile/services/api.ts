import * as SecureStore from 'expo-secure-store';
import { getApiUrl, UserType } from '@/lib/types';
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
    // Gestion silencieuse du cas 401 Unauthorized
    if (response.status === 401) {
      // Ne rien afficher, ne pas perturber l'utilisateur
      return null;
    }
    // En cas d'autre erreur, on log la réponse brute pour avoir plus de contexte.
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

export async function updateProfile(profileData: any) {
  // La route pour mettre à jour le profil de l'utilisateur courant
  const response = await fetch(`${API_URL}/profile/me`, {
    method: 'PUT',
    headers: await getHeaders(true),
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
}

export async function getProfilesToSwipe(userType: UserType, latitude: number, longitude: number) {
  // Détermine le bon endpoint en fonction du type d'utilisateur
  const endpoint = userType === 'candidate' ? 'recruiters' : 'candidates';
  // Le backend utilise le radius en query param (défaut 20000m)
  const url = `${API_URL}/discovery/${endpoint}`;

  const response = await fetch(url, {
    headers: await getHeaders(true),
  });
  return handleResponse(response);
}

export async function sendSwipeAction(profileId: string, direction: 'LEFT' | 'RIGHT') {
  const response = await fetch(`${API_URL}/swipes`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify({ profileId, direction }),
  });
  return handleResponse(response);
}

export async function undoPreviousSwipe() {
  // Placeholder function
  console.log("API CALL (simulation): Undoing last swipe.");
  return Promise.resolve({ success: true });
}

// ----------------------
// JOB OFFERS
// ----------------------
export async function getMyJobOffers() {
  const response = await fetch(`${API_URL}/job-offers/my-offers`, {
    headers: await getHeaders(true),
  });
  return handleResponse(response);
}

export async function createJobOffer(data: any) {
  const response = await fetch(`${API_URL}/job-offers`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function updateJobOffer(id: string, data: any) {
  const response = await fetch(`${API_URL}/job-offers/${id}`, {
    method: 'PUT',
    headers: await getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function deleteJobOffer(id: string) {
  const response = await fetch(`${API_URL}/job-offers/${id}`, {
    method: 'DELETE',
    headers: await getHeaders(true),
  });
  // For DELETE, we might not get a JSON body, so handle differently if needed
  if (response.status === 204) {
    return {}; // Or some other indicator of success
  }
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
// META DATA
// ----------------------

export async function getContractTypes() {
  const response = await fetch(`${API_URL}/meta/contract-types`, {
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

export async function getExperienceLevels() {
  const response = await fetch(`${API_URL}/meta/experience-levels`, {
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

export async function getJobCategories() {
  const response = await fetch(`${API_URL}/meta/job-categories`, {
    headers: await getHeaders(),
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

// ----------------------
// CV / RESUME
// ----------------------
export async function uploadResume(file: { uri: string; name: string; type: string }) {
  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) {
    throw new Error('Non authentifié');
  }

  const formData = new FormData();
  formData.append('resumeFile', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any);

  const response = await fetch(`${API_URL}/profile/resume`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
      // Ne pas mettre Content-Type pour multipart/form-data, il sera auto-généré
    },
    body: formData,
  });

  return handleResponse(response);
}

export async function deleteResume() {
  const token = await SecureStore.getItemAsync('auth_token');
  if (!token) {
    throw new Error('Non authentifié');
  }

  const response = await fetch(`${API_URL}/profile/resume`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
  });

  return handleResponse(response);
}

// ----------------------
// MATCHES / HISTORIQUE
// ----------------------
export async function getMatches() {
  const headers = await getHeaders(true);
  const response = await fetch(`${API_URL}/matches`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

export async function getMatchDetails(matchId: string) {
  const headers = await getHeaders(true);
  const response = await fetch(`${API_URL}/matches/${matchId}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}
