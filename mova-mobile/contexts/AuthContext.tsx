import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AppState } from 'react-native';
import { login as apiLogin, getMyProfile, updatePushToken } from '../services/api';
import { registerForPushNotificationsAsync } from '../services/notifications';

/**
 * AuthContext
 *
 * Provides authentication state and logic for the app.
 *
 * Main features:
 * - Stores and manages authentication state (isAuthenticated, user, token).
 * - Handles login, logout, and user refresh logic.
 * - Persists JWT token securely using expo-secure-store.
 * - Registers device for push notifications after login.
 * - Exposes a React context and hook for use throughout the app.
 *
 * Usage:
 *   import { AuthProvider, useAuth } from '@/contexts/AuthContext';
 *   <AuthProvider>{...}</AuthProvider>
 *   const { isAuthenticated, login, logout, user } = useAuth();
 */

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Refresh user profile from API
  const refreshUser = async () => {
    try {
      const userData = await getMyProfile();
      setUser(userData);
    } catch (error: any) {
      if (error.message?.includes('Utilisateur non trouvé') || error.message?.includes('Unauthorized')) {
        await logout();
        setLoading(false);
      }
    }
  };

  // Check for stored token on app start
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
          await refreshUser();
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  // Re-check token when app comes back to foreground (fixes Expo Go refresh issue)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        if (storedToken && !user) {
          setToken(storedToken);
          setIsAuthenticated(true);
          await refreshUser();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  // Additional check: if authenticated but no user data, reload it (handles Fast Refresh while app is active)
  useEffect(() => {
    const recheckUser = async () => {
      if (isAuthenticated && token && !user && !loading) {
        await refreshUser();
      }
    };
    recheckUser();
  }, [isAuthenticated, token, user, loading]);

  // Register for push notifications when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      registerForPushNotificationsAsync()
        .then(pushToken => {
          if (pushToken) {
            return updatePushToken(pushToken);
          }
        })
        .then(() => {
        })
        .catch(() => {
        });
    }
  }, [isAuthenticated, user]);

  // Login with email and password
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      if (response && response.accessToken) {
        await SecureStore.setItemAsync('auth_token', response.accessToken);
        setToken(response.accessToken);
        setIsAuthenticated(true);
        await refreshUser();
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
        return false;
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout and clear token
  const logout = async () => {
    try {
      try {
        await updatePushToken('');
      } catch (error) {
      }
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('refresh_token');
      await SecureStore.deleteItemAsync('last_match_count');
      await SecureStore.deleteItemAsync('last_profile_count');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
    }
  };

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    logout,
    loading,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
