import * as SecureStore from 'expo-secure-store';
import { getApiUrl, UserType } from '@/lib/types';
import { jwtDecode } from 'jwt-decode';

const API_URL = getApiUrl();

/**
 * api.ts
 *
 * Centralizes all API calls and helpers for the app.
 *
 * Main features:
 * - Handles authentication (login, register, token storage).
 * - Fetches and updates user profiles, job offers, companies, and metadata.
 * - Manages swipes, matches, resumes, and notifications.
 * - Provides helpers for consistent error handling and headers.
 *
 * Usage:
 *   import { login, getMyProfile, createCompany, ... } from '@/services/api';
 */

// Helper to handle API responses and errors
async function handleResponse(response: Response) {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`Erreur HTTP ${response.status}: Réponse non-JSON du serveur.`);
  }

  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw new Error(data.message || `Erreur HTTP ${response.status}`);
  }
  return data;
}

// Helper to create headers, with or without authentication
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

// AUTHENTICATION
/**
 * Register a new user and store authentication tokens
 */
export async function register(email: string, password: string, role: 'CANDIDATE' | 'RECRUITER') {
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

/**
 * Login user and store authentication tokens
 */
export async function login(email: string, password: string) {
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

// PROFILE & SWIPE
/**
 * Fetch the current user's profile
 */
export async function getMyProfile() {
  const response = await fetch(`${API_URL}/profile/me`, {
    headers: await getHeaders(true),
  });
  return handleResponse(response);
}

/**
 * Update user profile information and optionally upload a photo
 */
export async function updateProfile(
  profileData: any,
  photoUri?: string
) {
  const response = await fetch(`${API_URL}/profile/me`, {
    method: 'PUT',
    headers: await getHeaders(true),
    body: JSON.stringify(profileData),
  });
  const result = await handleResponse(response);
  
  if (photoUri) {
    await uploadProfilePhoto(photoUri);
  }
  
  return result;
}

/**
 * Upload a profile photo
 */
export async function uploadProfilePhoto(photoUri: string) {
  const token = await SecureStore.getItemAsync('auth_token');
  const formData = new FormData();
  
  const filename = photoUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';
  
  formData.append('photoFile', {
    uri: photoUri,
    name: filename,
    type,
  } as any);
  
  const response = await fetch(`${API_URL}/profile/photo`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true',
    },
    body: formData,
  });
  
  return handleResponse(response);
}

// SWIPES
/**
 * Fetch profiles to swipe based on user type and location
 */
export async function getProfilesToSwipe(userType: UserType, latitude: number, longitude: number) {
  const endpoint = userType === 'candidate' ? 'recruiters' : 'candidates';
  const url = `${API_URL}/discovery/${endpoint}?latitude=${latitude}&longitude=${longitude}`;

  const response = await fetch(url, {
    headers: await getHeaders(true),
  });
  return handleResponse(response);
}

/**
 * Send a swipe action (LEFT or RIGHT) for a profile
 */
export async function sendSwipeAction(profileId: string, direction: 'LEFT' | 'RIGHT') {
  const response = await fetch(`${API_URL}/swipes`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify({ profileId, direction }),
  });
  return handleResponse(response);
}

/**
 * Undo the previous swipe action
 */
export async function undoPreviousSwipe() {
  const response = await fetch(`${API_URL}/swipes/undo`, {
    method: 'DELETE',
    headers: await getHeaders(true),
  });
  return handleResponse(response);
}

// JOB OFFERS
/**
 * Fetch all job offers created by the current recruiter
 */
export async function getMyJobOffers() {
  const response = await fetch(`${API_URL}/job-offers/my-offers`, {
    headers: await getHeaders(true),
  });
  return handleResponse(response);
}

/**
 * Create a new job offer
 */
export async function createJobOffer(data: any) {
  const response = await fetch(`${API_URL}/job-offers`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Update an existing job offer
 */
export async function updateJobOffer(id: string, data: any) {
  const response = await fetch(`${API_URL}/job-offers/${id}`, {
    method: 'PUT',
    headers: await getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Delete a job offer
 */
export async function deleteJobOffer(id: string) {
  const response = await fetch(`${API_URL}/job-offers/${id}`, {
    method: 'DELETE',
    headers: await getHeaders(true),
  });
  if (response.status === 204) {
    return {};
  }
  return handleResponse(response);
}

// COMPANY
/**
 * Create a new company
 */
export async function createCompany(data: { companyName: string; siret: string }) {
  const response = await fetch(`${API_URL}/companies/onboarding`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

/**
 * Join an existing company by SIRET
 */
export async function joinCompany(data: { siret: string }) {
  const response = await fetch(`${API_URL}/onboarding/recruiter/join-company`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

// META DATA
/**
 * Fetch available contract types
 */
export async function getContractTypes() {
  const response = await fetch(`${API_URL}/meta/contract-types`, {
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

/**
 * Fetch available experience levels
 */
export async function getExperienceLevels() {
  const response = await fetch(`${API_URL}/meta/experience-levels`, {
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

/**
 * Fetch available job categories
 */
export async function getJobCategories() {
  const response = await fetch(`${API_URL}/meta/job-categories`, {
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

// UTILITIES
/**
 * Check if the backend is healthy
 */
export async function checkBackendHealth() {
  const response = await fetch(`${API_URL}/health`, {
    headers: await getHeaders(),
  });
  return handleResponse(response);
}

// PUSH NOTIFICATIONS
/**
 * Update the push notification token
 */
export async function updatePushToken(token: string) {
  const response = await fetch(`${API_URL}/profile/push-token`, {
    method: 'POST',
    headers: await getHeaders(true),
    body: JSON.stringify({ token }),
  });
  return handleResponse(response);
}

/**
 * Get geolocation name from coordinates using Google Maps API
 */
export async function getGoogleGeolocation(latitude: number, longitude: number) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`
  );
  return handleResponse(response);
}

// CV / RESUME
/**
 * Upload a resume/CV file
 */
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
    },
    body: formData,
  });

  return handleResponse(response);
}

/**
 * Delete the user's resume
 */
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

// MATCHES / HISTORY
/**
 * Fetch all matches
 */
export async function getMatches() {
  const headers = await getHeaders(true);
  const response = await fetch(`${API_URL}/matches`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}

/**
 * Fetch details of a specific match
 */
export async function getMatchDetails(matchId: string) {
  const headers = await getHeaders(true);
  const response = await fetch(`${API_URL}/matches/${matchId}`, {
    method: 'GET',
    headers,
  });
  return handleResponse(response);
}
