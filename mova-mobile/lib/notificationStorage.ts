import * as SecureStore from 'expo-secure-store';

/**
 * notificationStorage.ts
 * 
 * Gère le stockage local des notifications et matchs lus/non lus
 * pour afficher les badges corrects sur les onglets.
 */

const VIEWED_PROFILES_KEY = 'viewed_profiles';
const VIEWED_MATCHES_KEY = 'viewed_matches';
const LAST_PROFILE_COUNT_KEY = 'last_profile_count';
const LAST_MATCH_COUNT_KEY = 'last_match_count';

// --- Gestion des profils (notifications de proximité) ---

/**
 * Marquer tous les profils actuels comme vus
 */
export async function markAllProfilesAsViewed(): Promise<void> {
  try {
    await SecureStore.setItemAsync(LAST_PROFILE_COUNT_KEY, '0');
  } catch (error) {
    console.error('Erreur lors du marquage des profils comme vus:', error);
  }
}

/**
 * Obtenir le nombre de nouveaux profils à swiper
 */
export async function getNewProfilesCount(currentCount: number): Promise<number> {
  try {
    const lastCountStr = await SecureStore.getItemAsync(LAST_PROFILE_COUNT_KEY);
    const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
    
    // Si on a plus de profils qu'avant, on a de nouveaux profils
    const newCount = Math.max(0, currentCount - lastCount);
    
    return newCount;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de nouveaux profils:', error);
    return currentCount;
  }
}

/**
 * Mettre à jour le compteur de profils après un swipe
 */
export async function updateProfileCount(newCount: number): Promise<void> {
  try {
    await SecureStore.setItemAsync(LAST_PROFILE_COUNT_KEY, newCount.toString());
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compteur de profils:', error);
  }
}

// --- Gestion des matchs ---

/**
 * Marquer tous les matchs comme vus
 */
export async function markAllMatchesAsViewed(): Promise<void> {
  try {
    // On ne fait rien ici, on mettra à jour uniquement après avoir récupéré le nouveau compte
  } catch (error) {
    console.error('Erreur lors du marquage des matchs comme vus:', error);
  }
}

/**
 * Obtenir le nombre de nouveaux matchs non lus
 */
export async function getNewMatchesCount(currentCount: number): Promise<number> {
  try {
    const lastCountStr = await SecureStore.getItemAsync(LAST_MATCH_COUNT_KEY);
    const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
    
    // Si on a plus de matchs qu'avant, on a de nouveaux matchs
    const newCount = Math.max(0, currentCount - lastCount);
    
    return newCount;
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de nouveaux matchs:', error);
    return currentCount;
  }
}

/**
 * Mettre à jour le compteur de matchs
 */
export async function updateMatchCount(newCount: number): Promise<void> {
  try {
    await SecureStore.setItemAsync(LAST_MATCH_COUNT_KEY, newCount.toString());
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compteur de matchs:', error);
  }
}

/**
 * Réinitialiser tous les compteurs (utile lors de la déconnexion)
 */
export async function resetAllCounters(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(VIEWED_PROFILES_KEY);
    await SecureStore.deleteItemAsync(VIEWED_MATCHES_KEY);
    await SecureStore.deleteItemAsync(LAST_PROFILE_COUNT_KEY);
    await SecureStore.deleteItemAsync(LAST_MATCH_COUNT_KEY);
  } catch (error) {
    console.error('Erreur lors de la réinitialisation des compteurs:', error);
  }
}
