import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { login as apiLogin, getMyProfile } from '../services/api';


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

  const refreshUser = async () => {
    try {
      const userData = await getMyProfile();
      setUser(userData);
    } catch (error: any) {
      console.error("Erreur lors du rafraîchissement de l'utilisateur:", error);
      // Si l'utilisateur n'existe plus (404) ou token invalide, on déconnecte
      if (error.message?.includes('Utilisateur non trouvé') || error.message?.includes('Unauthorized')) {
        console.log("🚪 Déconnexion automatique: utilisateur non trouvé ou token invalide");
        await logout();
        setLoading(false); // Important: débloquer le chargement
      }
    }
  };

  // Vérifier le token stocké au démarrage
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
          await refreshUser(); // On utilise notre nouvelle fonction
          setLoading(false); // Débloquer après le refresh
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  // Login JWT classique
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      if (response && response.accessToken) {
        await SecureStore.setItemAsync('auth_token', response.accessToken);
        setToken(response.accessToken);
        setIsAuthenticated(true);
        await refreshUser(); // On utilise aussi notre fonction ici
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

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};