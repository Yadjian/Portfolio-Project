import * as SecureStore from 'expo-secure-store';

/**
 * notificationStorage.ts
 * 
 * Manages local storage for read/unread notifications and matches
 * to display correct badge counts on tabs.
 */

// SecureStore keys for persisting notification state
const VIEWED_PROFILES_KEY = 'viewed_profiles';
const VIEWED_MATCHES_KEY = 'viewed_matches';
const LAST_PROFILE_COUNT_KEY = 'last_profile_count';
const LAST_MATCH_COUNT_KEY = 'last_match_count';

// --- Profile Management (proximity notifications) ---

/**
 * Mark all current profiles as viewed
 * 
 * Resets the profile counter to 0, indicating all profiles have been seen.
 * Used when user visits the discovery/swipe screen.
 */
export async function markAllProfilesAsViewed(): Promise<void> {
  try {
    await SecureStore.setItemAsync(LAST_PROFILE_COUNT_KEY, '0');
  } catch (error) {
    console.error('Error marking profiles as viewed:', error);
  }
}

/**
 * Get the count of new profiles to swipe
 * 
 * Compares the current profile count with the last stored count
 * to determine how many new profiles are available.
 * 
 * @param currentCount - Current number of available profiles
 * @returns Number of new profiles since last visit
 */
export async function getNewProfilesCount(currentCount: number): Promise<number> {
  try {
    const lastCountStr = await SecureStore.getItemAsync(LAST_PROFILE_COUNT_KEY);
    const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
    
    // If we have more profiles than before, we have new profiles
    const newCount = Math.max(0, currentCount - lastCount);
    
    return newCount;
  } catch (error) {
    console.error('Error retrieving new profiles count:', error);
    return currentCount;
  }
}

/**
 * Update the profile counter after a swipe
 * 
 * Stores the new profile count to persist the state across app sessions.
 * 
 * @param newCount - Updated count of profiles
 */
export async function updateProfileCount(newCount: number): Promise<void> {
  try {
    await SecureStore.setItemAsync(LAST_PROFILE_COUNT_KEY, newCount.toString());
  } catch (error) {
    console.error('Error updating profile counter:', error);
  }
}

// --- Match Management ---

/**
 * Mark all matches as viewed
 * 
 * Currently a placeholder - the actual counter update happens
 * after fetching the new match count in the calling code.
 */
export async function markAllMatchesAsViewed(): Promise<void> {
  try {
    // No-op here, counter will be updated after fetching new count
  } catch (error) {
    console.error('Error marking matches as viewed:', error);
  }
}

/**
 * Get the count of new unread matches
 * 
 * Compares the current match count with the last stored count
 * to determine how many new matches have occurred.
 * 
 * @param currentCount - Current number of matches
 * @returns Number of new matches since last visit
 */
export async function getNewMatchesCount(currentCount: number): Promise<number> {
  try {
    const lastCountStr = await SecureStore.getItemAsync(LAST_MATCH_COUNT_KEY);
    const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
    
    // If we have more matches than before, we have new matches
    const newCount = Math.max(0, currentCount - lastCount);
    
    return newCount;
  } catch (error) {
    console.error('Error retrieving new matches count:', error);
    return currentCount;
  }
}

/**
 * Update the match counter
 * 
 * Stores the new match count to persist the state across app sessions.
 * 
 * @param newCount - Updated count of matches
 */
export async function updateMatchCount(newCount: number): Promise<void> {
  try {
    await SecureStore.setItemAsync(LAST_MATCH_COUNT_KEY, newCount.toString());
  } catch (error) {
    console.error('Error updating match counter:', error);
  }
}

/**
 * Reset all counters
 * 
 * Clears all stored notification and match counters from SecureStore.
 * Useful when user logs out to ensure fresh state on next login.
 */
export async function resetAllCounters(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(VIEWED_PROFILES_KEY);
    await SecureStore.deleteItemAsync(VIEWED_MATCHES_KEY);
    await SecureStore.deleteItemAsync(LAST_PROFILE_COUNT_KEY);
    await SecureStore.deleteItemAsync(LAST_MATCH_COUNT_KEY);
  } catch (error) {
    console.error('Error resetting counters:', error);
  }
}
