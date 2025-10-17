import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = 'http://192.168.219.21:8081/api'; // Mets l'URL de ton backend ici

// ----------------------
// AUTHENTIFICATION (MOCK)
// ----------------------
export async function register(email: string, password: string) {
  // Simule une réponse backend
  return {
    success: true,
    user: { email },
    message: 'Compte créé (mock)',
  };
}

export async function login(email: string, password: string) {
  // --- À ACTIVER QUAND LE BACKEND EST PRÊT ---
  // try {
  //   const response = await fetch(`${API_BASE_URL}/auth/login`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password }),
  //   });
  //   const data = await response.json();
  //   if (!response.ok) {
  //     return { success: false, message: data.message || 'Erreur de connexion' };
  //   }
  //   // Stocke le token JWT
  //   await SecureStore.setItemAsync('auth_token', data.token);
  //   return {
  //     success: true,
  //     token: data.token,
  //     user: data.user, // Doit contenir le type (candidate/recruiter)
  //     message: 'Connexion réussie',
  //   };
  // } catch (err) {
  //   return { success: false, message: 'Erreur réseau ou serveur' };
  // }

  // --- MOCK POUR LE DEV SANS BACKEND ---
  const fakeToken = 'mock-jwt-token';
  const userType = email.includes('recruteur') ? 'recruiter' : 'candidate';
  await SecureStore.setItemAsync('auth_token', fakeToken);
  return {
    success: true,
    token: fakeToken,
    user: { email, type: userType },
    message: 'Connexion réussie (mock)',
  };
}

// ----------------------
// UTILISATEUR
// ----------------------
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

// ----------------------
// ENTREPRISE
// ----------------------
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

// ----------------------
// UTILITAIRES
// ----------------------
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

