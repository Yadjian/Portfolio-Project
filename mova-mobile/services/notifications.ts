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
 * 
 * IMPORTANT: Imports conditionnels pour éviter les erreurs dans Expo Go
 */

// Vérifier si on est dans Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Import conditionnel pour éviter l'erreur dans Expo Go
let Notifications: any = null;
let Device: any = null;

if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Notifications = require('expo-notifications');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Device = require('expo-device');
    
    // Configure comment les notifications sont affichées
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    
    console.log('✅ [Notifications] Module expo-notifications chargé');
  } catch (error) {
    console.warn('⚠️ [Notifications] Impossible de charger expo-notifications:', error);
  }
} else {
  console.log('ℹ️ [Notifications] Expo Go détecté - Mode simulation sans notifications');
}

/**
 * Enregistre l'appareil pour recevoir des push notifications
 * et retourne le token Expo Push.
 * 
 * @returns Le token Expo Push (string) ou undefined si échec
 */
export async function registerForPushNotificationsAsync() {
  // Si on est dans Expo Go ou modules non chargés, retourner undefined
  if (isExpoGo || !Notifications || !Device) {
    console.log('ℹ️ [Notifications] Mode simulation - Pas de push token');
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
