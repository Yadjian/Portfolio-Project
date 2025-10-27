import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * notifications.ts
 * 
 * Service pour gérer les push notifications Expo.
 * 
 * Responsabilités :
 * - Demander les permissions de notifications
 * - Obtenir le token Expo Push pour envoyer des notifications
 * - Configurer le comportement des notifications (son, badge, alerte)
 * 
 * Note: Les push notifications ne fonctionnent PAS dans Expo Go (SDK 53+).
 * Utilisez un development build pour tester les notifications.
 */

// Vérifier si on est dans Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Configure comment les notifications sont affichées (seulement si pas Expo Go)
if (!isExpoGo) {
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,      // Afficher l'alerte
        shouldPlaySound: true,      // Jouer un son
        shouldSetBadge: true,       // Mettre à jour le badge de l'app
        shouldShowBanner: true,     // Afficher la bannière (iOS)
        shouldShowList: true,       // Afficher dans la liste de notifications
      }),
    });
  } catch (error) {
    console.warn('⚠️ [Notifications] Impossible de configurer le handler (normal dans Expo Go):', error);
  }
} else {
  console.warn('⚠️ [Notifications] Expo Go détecté - Les push notifications ne sont pas disponibles');
}

/**
 * Enregistre l'appareil pour recevoir des push notifications
 * et retourne le token Expo Push.
 * 
 * @returns Le token Expo Push (string) ou undefined si échec
 */
export async function registerForPushNotificationsAsync() {
  // Si on est dans Expo Go, ne pas essayer d'obtenir un token
  if (isExpoGo) {
    console.warn('⚠️ [Notifications] Expo Go ne supporte pas les push notifications (SDK 53+)');
    console.warn('💡 [Notifications] Utilisez un development build pour tester les notifications');
    return undefined;
  }

  let token: string | undefined;

  // Configuration Android : créer un canal de notification
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6347', // Couleur Mova
    });
  }

  // Vérifier si c'est un appareil physique (émulateur ne supporte pas les push)
  if (Device.isDevice) {
    // Vérifier les permissions existantes
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // Si pas encore accordées, demander les permissions
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // Si permissions refusées, informer l'utilisateur
    if (finalStatus !== 'granted') {
      console.warn('❌ Permission de notifications refusée');
      return;
    }
    
    // Obtenir le token Expo Push
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('📱 Expo Push Token obtenu:', token);
    } catch (error) {
      console.error('❌ Erreur lors de l\'obtention du push token:', error);
    }
  } else {
    console.warn('⚠️ Les push notifications nécessitent un appareil physique');
  }

  return token;
}
