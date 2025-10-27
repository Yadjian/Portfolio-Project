import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getNewProfilesCount, getNewMatchesCount, updateProfileCount, updateMatchCount } from '@/lib/notificationStorage';
import { getMatches, getProfilesToSwipe, getMyProfile } from '@/services/api';
import * as Location from 'expo-location';
import { useAuth } from './AuthContext';

/**
 * NotificationContext
 * 
 * Contexte global pour gérer les compteurs de badges de notifications
 * à travers toute l'application.
 */

interface NotificationContextType {
  profileBadgeCount: number;
  matchBadgeCount: number;
  setProfileBadgeCount: (count: number) => void;
  setMatchBadgeCount: (count: number) => void;
  refreshMatchBadge: () => Promise<void>;
  refreshProfileBadge: (currentProfileCount?: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [profileBadgeCount, setProfileBadgeCount] = useState(0);
  const [matchBadgeCount, setMatchBadgeCount] = useState(0);

  // Rafraîchir le badge des matchs
  const refreshMatchBadge = useCallback(async () => {
    try {
      const matches = await getMatches();
      if (!matches) {
        console.log('[NotificationContext] Pas de matches (utilisateur non connecté ou erreur)');
        setMatchBadgeCount(0);
        return;
      }
      const currentMatchCount = matches.length;
      
      // Lire le dernier compteur stocké
      const lastCountStr = await SecureStore.getItemAsync('last_match_count');
      const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
      
      // Calculer les nouveaux matchs
      const newMatchCount = Math.max(0, currentMatchCount - lastCount);
      
      console.log('[NotificationContext] 📊 Matches actuels:', currentMatchCount);
      console.log('[NotificationContext] 💾 Dernier count stocké:', lastCount);
      console.log('[NotificationContext] 🔔 Nouveaux matchs à afficher:', newMatchCount);
      
      setMatchBadgeCount(newMatchCount);
      
      // Ne pas mettre à jour le compteur maintenant, on le fera quand l'utilisateur visite la page
    } catch (error) {
      console.log('[NotificationContext] Erreur badge matchs (ignorée):', error);
      setMatchBadgeCount(0);
    }
  }, []);

  // Rafraîchir le badge des profils
  const refreshProfileBadge = useCallback(async (currentProfileCount?: number) => {
    try {
      let profileCount = currentProfileCount;
      
      // Si pas fourni, on récupère depuis le backend
      if (profileCount === undefined) {
        console.log('[NotificationContext] 🔄 Récupération des profils depuis le backend...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('[NotificationContext] ❌ Permission de géolocalisation refusée');
          profileCount = 0;
        } else {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          
          // Déterminer le userType depuis le user du AuthContext
          const profile = await getMyProfile();
          const userType = profile?.candidateProfile ? 'candidate' : 'recruiter';
          console.log('[NotificationContext] 👤 UserType détecté:', userType);
          
          const profiles = await getProfilesToSwipe(userType, latitude, longitude);
          profileCount = profiles?.length || 0;
          console.log('[NotificationContext] 📦 Profils récupérés:', profileCount);
        }
      }
      
      // Lire le dernier compteur stocké
      const lastCountStr = await SecureStore.getItemAsync('last_profile_count');
      const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
      
      // Calculer les nouveaux profils
      const newProfileCount = Math.max(0, (profileCount || 0) - lastCount);
      
      console.log('[NotificationContext] 📊 Profils actuels:', profileCount);
      console.log('[NotificationContext] 💾 Dernier count stocké:', lastCount);
      console.log('[NotificationContext] 🔔 Nouveaux profils à afficher:', newProfileCount);
      
      setProfileBadgeCount(newProfileCount);
      
      // Ne pas mettre à jour le compteur maintenant, on le fera quand l'utilisateur visite la page
    } catch (error) {
      console.log('[NotificationContext] Erreur badge profils (ignorée):', error);
      setProfileBadgeCount(0);
    }
  }, []);

  // Initialiser les badges quand l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('[NotificationContext] 🔔 Utilisateur connecté, chargement des badges...');
      refreshMatchBadge();
      refreshProfileBadge();
    } else {
      console.log('[NotificationContext] 🚪 Utilisateur déconnecté, reset des badges');
      setProfileBadgeCount(0);
      setMatchBadgeCount(0);
    }
  }, [isAuthenticated, user, refreshMatchBadge, refreshProfileBadge]);

  return (
    <NotificationContext.Provider
      value={{
        profileBadgeCount,
        matchBadgeCount,
        setProfileBadgeCount,
        setMatchBadgeCount,
        refreshMatchBadge,
        refreshProfileBadge,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
