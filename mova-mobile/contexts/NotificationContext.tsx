import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getNewProfilesCount, getNewMatchesCount, updateProfileCount, updateMatchCount } from '@/lib/notificationStorage';
import { getMatches, getProfilesToSwipe, getMyProfile } from '@/services/api';
import * as Location from 'expo-location';
import { useAuth } from './AuthContext';

/**
 * NotificationContext
 * 
 * Global context to manage notification badge counters throughout the application.
 * Handles badge counts for new profiles and new matches, with automatic refresh
 * when user authenticates and manual refresh capabilities.
 */

// Type definition for the notification context
interface NotificationContextType {
  profileBadgeCount: number; // Number of new profiles to display on bell icon
  matchBadgeCount: number; // Number of new matches to display on heart icon
  setProfileBadgeCount: (count: number) => void; // Manually set profile badge count
  setMatchBadgeCount: (count: number) => void; // Manually set match badge count
  refreshMatchBadge: () => Promise<void>; // Fetch and update match badge count from backend
  refreshProfileBadge: (currentProfileCount?: number) => Promise<void>; // Fetch and update profile badge count from backend
  simulateProfileNotification: () => void; // Testing function to simulate profile notifications
  simulateMatchNotification: () => void; // Testing function to simulate match notifications
}

// Create the context with undefined as default (will be provided by NotificationProvider)
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * NotificationProvider Component
 * 
 * Wraps the application to provide notification badge management functionality.
 * Automatically refreshes badges when user authenticates and resets when user logs out.
 */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  // State for badge counters
  const [profileBadgeCount, setProfileBadgeCount] = useState(0);
  const [matchBadgeCount, setMatchBadgeCount] = useState(0);

  // Testing function: Simulate a profile notification (bell icon)
  const simulateProfileNotification = useCallback(() => {
    setProfileBadgeCount(prev => prev + 2); // Changed from +3 to +2
  }, []);

  // Testing function: Simulate a match notification (heart icon)
  const simulateMatchNotification = useCallback(() => {
    setMatchBadgeCount(prev => prev + 1);
  }, []);

  /**
   * Refresh match badge count
   * 
   * Fetches current matches from backend, compares with last stored count,
   * and updates the badge to show only new matches since last visit.
   */
  const refreshMatchBadge = useCallback(async () => {
    try {
      const matches = await getMatches();
      if (!matches) {
        setMatchBadgeCount(0);
        return;
      }
      const currentMatchCount = matches.length;
      // Read last stored count from secure storage
      const lastCountStr = await SecureStore.getItemAsync('last_match_count');
      const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
      // Calculate new matches since last visit
      const newMatchCount = Math.max(0, currentMatchCount - lastCount);
      setMatchBadgeCount(newMatchCount);
      // Note: Counter will be updated when user visits the matches page
      
      // Return the current match count for simulation logic
      return currentMatchCount;
    } catch (error) {
      setMatchBadgeCount(0);
      return 0;
    }
  }, []);

  /**
   * Refresh profile badge count
   * 
   * Fetches current profiles from backend (or uses provided count), compares with 
   * last stored count, and updates the badge to show only new profiles since last visit.
   * 
   * @param currentProfileCount - Optional: Current profile count if already fetched
   */
  const refreshProfileBadge = useCallback(async (currentProfileCount?: number) => {
    try {
      let profileCount = currentProfileCount;
      // If not provided, fetch from backend
      if (profileCount === undefined) {
        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          profileCount = 0;
        } else {
          // Get current location
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          // Determine user type from AuthContext user profile
          const profile = await getMyProfile();
          const userType = profile?.candidateProfile ? 'candidate' : 'recruiter';
          // Fetch profiles to swipe
          const profiles = await getProfilesToSwipe(userType, latitude, longitude);
          profileCount = profiles?.length || 0;
        }
      }
      // Read last stored count from secure storage
      const lastCountStr = await SecureStore.getItemAsync('last_profile_count');
      const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
      // Calculate new profiles since last visit
      const newProfileCount = Math.max(0, (profileCount || 0) - lastCount);
      setProfileBadgeCount(newProfileCount);
      // Note: Counter will be updated when user visits the discovery page
    } catch (error) {
      setProfileBadgeCount(0);
    }
  }, []);

  /**
   * Initialize badges when user authenticates
   * 
   * Automatically called when authentication state changes.
   * Loads badge counts on login and resets them on logout.
   * Also includes simulation for testing purposes.
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshMatchBadge();
      refreshProfileBadge();
      
      // TODO: Real push notifications are ready (backend + frontend) but require a development build
      // Expo Go does NOT support push notifications (SDK 53+)
      // Using simulation for now until we deploy with a development build
      setTimeout(() => {
        simulateProfileNotification(); // Bell badge +2
        // Match notification simulation is triggered only when a real match occurs (in SwipeNotificationScreen)
        // Not simulated at login to be more realistic
      }, 1000); // Small delay to make it visible
    } else {
      setProfileBadgeCount(0);
      setMatchBadgeCount(0);
    }
  }, [isAuthenticated, user, refreshMatchBadge, refreshProfileBadge, simulateProfileNotification]);

  return (
    <NotificationContext.Provider
      value={{
        profileBadgeCount,
        matchBadgeCount,
        setProfileBadgeCount,
        setMatchBadgeCount,
        refreshMatchBadge,
        refreshProfileBadge,
        simulateProfileNotification,
        simulateMatchNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

/**
 * useNotifications Hook
 * 
 * Custom hook to access notification context from any component.
 * Must be used within a NotificationProvider.
 * 
 * @throws Error if used outside of NotificationProvider
 * @returns NotificationContextType - Notification badge management functions and state
 */
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
