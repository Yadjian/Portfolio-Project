import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * notifications.ts
 * 
 * Service to manage Expo push notifications.
 * 
 * Responsibilities:
 * - Request notification permissions
 * - Obtain Expo Push token for sending notifications
 * - Configure notification behavior (sound, badge, alert)
 * 
 * Note: Push notifications do NOT work in Expo Go (SDK 53+).
 * Use a development build to test notifications.
 * 
 * IMPORTANT: Conditional imports to avoid errors in Expo Go
 */

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Conditional import to avoid errors in Expo Go
let Notifications: any = null;
let Device: any = null;

if (!isExpoGo) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Notifications = require('expo-notifications');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Device = require('expo-device');
    
    // Configure how notifications are displayed when app is in foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    
    console.log('✅ [Notifications] expo-notifications module loaded');
  } catch (error) {
    console.warn('⚠️ [Notifications] Unable to load expo-notifications:', error);
  }
} else {
  console.log('ℹ️ [Notifications] Expo Go detected - Simulation mode without notifications');
}

/**
 * Register device for push notifications
 * 
 * Handles the complete flow for enabling push notifications:
 * 1. Creates Android notification channel if needed
 * 2. Checks device compatibility (physical device required)
 * 3. Requests notification permissions from user
 * 4. Retrieves and returns the Expo Push token
 * 
 * @returns Expo Push token (string) or undefined if failed or unavailable
 */
export async function registerForPushNotificationsAsync() {
  // If running in Expo Go or modules not loaded, return undefined
  if (isExpoGo || !Notifications || !Device) {
    console.log('ℹ️ [Notifications] Simulation mode - No push token');
    return undefined;
  }

  let token: string | undefined;

  // Android configuration: Create notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF6347', // Mova brand color
    });
  }

  // Check if it's a physical device (emulators don't support push notifications)
  if (Device.isDevice) {
    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // If not granted yet, request permissions
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // If permissions denied, inform user
    if (finalStatus !== 'granted') {
      console.warn('❌ Notification permission denied');
      return;
    }
    
    // Obtain Expo Push token
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('📱 Expo Push Token obtained:', token);
    } catch (error) {
      console.error('❌ Error obtaining push token:', error);
    }
  } else {
    console.warn('⚠️ Push notifications require a physical device');
  }

  return token;
}
