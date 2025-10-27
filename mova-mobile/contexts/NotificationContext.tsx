import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getNewProfilesCount, getNewMatchesCount, updateProfileCount, updateMatchCount } from '@/lib/notificationStorage';
import { getMatches, getProfilesToSwipe } from '@/services/api';
import * as Location from 'expo-location';

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
  refreshProfileBadge: (currentProfileCount: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [profileBadgeCount, setProfileBadgeCount] = useState(0);
  const [matchBadgeCount, setMatchBadgeCount] = useState(0);

  // Rafraîchir le badge des matchs
  const refreshMatchBadge = useCallback(async () => {
    try {
      const matches = await getMatches();
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
      console.error('Erreur lors du rafraîchissement du badge des matchs:', error);
    }
  }, []);

  // Rafraîchir le badge des profils
  const refreshProfileBadge = useCallback(async (currentProfileCount?: number) => {
    try {
      let profileCount = currentProfileCount;
      
      // Si pas fourni, on récupère depuis le backend
      if (profileCount === undefined) {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            // Note: On ne connaît pas le userType ici, donc on pourrait avoir un problème
            // Pour l'instant, on va juste estimer à 0 si on ne peut pas récupérer
            console.log('[NotificationContext] ⚠️ Impossible de déterminer userType pour récupérer les profils');
            profileCount = 0;
          }
        } catch (error) {
          console.log('[NotificationContext] ⚠️ Erreur de géolocalisation:', error);
          profileCount = 0;
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
      console.error('Erreur lors du rafraîchissement du badge des profils:', error);
    }
  }, []);

  // Initialiser les badges au montage
  useEffect(() => {
    refreshMatchBadge();
  }, [refreshMatchBadge]);

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
