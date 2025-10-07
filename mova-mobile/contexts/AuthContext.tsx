import React, { createContext, useContext, useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '../constants/auth0Config';
import { getCurrentUser } from '../services/api'; // Ajoute cet import en haut


interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  login: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/oauth/revoke`,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const redirectUri = AuthSession.makeRedirectUri({
    preferLocalhost: true,
  });

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        audience: `https://${AUTH0_DOMAIN}/userinfo`,
      },
      responseType: AuthSession.ResponseType.Token,
      redirectUri,
    },
    discovery
  );

  // Vérifier le token stocké au démarrage
  useEffect(() => {
  const checkToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);

        // Appel GET /me ici
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          setUser(null);
        }
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };
  checkToken();
}, []);

  // Gestion complète du résultat de l'authentification
  useEffect(() => {
    if (result) {
      console.log('Résultat Auth0:', result); // Debug
      
      if (result.type === 'success') {
        const { access_token } = result.params;
        handleAuthSuccess(access_token);
      } else if (result.type === 'error') {
        console.error('Erreur de connexion:', result.error);
        setLoading(false); // arrêter le loading
      } else if (result.type === 'cancel') {
        console.log('Connexion annulée par l\'utilisateur');
        setLoading(false); // arrêter le loading
      } else {
        console.log('Type de résultat non géré:', result.type);
        setLoading(false); // arrêter le loading
      }
    }
  }, [result]);

  // Gestion d'erreur améliorée
  const handleAuthSuccess = async (accessToken: string) => {
    try {
      console.log('Token reçu:', accessToken); // Debug
      
      // Récupérer les informations utilisateur
      const userResponse = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!userResponse.ok) {
        throw new Error(`Erreur HTTP: ${userResponse.status}`);
      }
      
      const userData = await userResponse.json();
      console.log('Données utilisateur:', userData); // Debug
      
      // Stocker le token et les données utilisateur
      await SecureStore.setItemAsync('auth_token', accessToken);
      await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
      
      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      // En cas d'erreur, ne pas rester connecté
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // toujours arrêter le loading
    }
  };

  // Gestion d'erreur dans login
  const login = async () => {
    try {
      setLoading(true);
      console.log('Début de connexion...'); // Debug
      
      // Vérifier que la requête est prête
      if (request) {
        await promptAsync();
      } else {
        console.error('Request Auth0 non prête');
        setLoading(false);
      }
    } catch (error) {
      console.error('Erreur lors du login:', error);
      setLoading(false); // arrêter le loading en cas d'erreur
    }
  };

  const logout = async () => {
    try {
      // Supprimer les données stockées
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
      
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