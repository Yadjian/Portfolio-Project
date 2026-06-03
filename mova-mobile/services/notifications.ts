import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

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
 * Note: Requires a development build (EAS Build or standalone).
 * Does NOT work in Expo Go (SDK 53+).
 */

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
  let token: string | undefined;

  // Android configuration: Create notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4930a3',
    });
  }

  // Check if it's a physical device
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
      console.warn('Push notification permissions not granted');
      return;
    }
    
    // Obtain Expo Push token
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } catch (error) {
      console.error('Error obtaining push token:', error);
    }
  } else {
    console.warn('Push notifications require a physical device');
  }

  return token;
}
