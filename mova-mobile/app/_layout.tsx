import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import AuthStack from '@/app/navigation/AuthStack';
import * as ExpoCrypto from 'expo-crypto';
import Constants from 'expo-constants';

const isExpoGoApp = Constants.appOwnership === 'expo';
let Notifications: any = null;

if (!isExpoGoApp) {
  try {
    Notifications = require('expo-notifications');
  } catch (error) {
  }
}

/**
 * RootLayout
 *
 * This is the main entry point for the app layout.
 *
 * Main features:
 * - Loads custom fonts and icons before rendering the app.
 * - Polyfills global.crypto.getRandomValues for compatibility.
 * - Wraps the app in the AuthProvider for authentication context.
 * - Handles splash screen display until fonts are loaded.
 * - Chooses between dark and light theme based on user preference.
 * - Listens for push notifications and updates badge counts.
 * - Renders the authentication stack (AuthStack) for both authenticated and unauthenticated users (can be customized).
 *
 * Key logic:
 * - Polyfills crypto for secure random values (needed by some libraries).
 * - Uses useFonts and SplashScreen to ensure assets are loaded before showing the app.
 * - Uses useAuth to check authentication state and loading.
 */

if (!global.crypto) {
  const getRandomValues = <T extends ArrayBufferView>(array: T): T => {
    const byteView = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);

    if ('assertByteCount' in ExpoCrypto) {
      (ExpoCrypto as any).assertByteCount?.(byteView.length);
    }

    const bytes = (ExpoCrypto as any).getRandomBytes
      ? (ExpoCrypto as any).getRandomBytes(byteView.length)
      :
        Array.from({ length: byteView.length }, () => Math.floor(Math.random() * 256));

    byteView.set(bytes);
    return array;
  };
  // @ts-ignore
  global.crypto = { getRandomValues };
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <RootLayoutNav />
      </NotificationProvider>
    </AuthProvider>
  );
}

/**
 * RootLayoutNav
 * Applies theme, handles notifications, displays AuthStack
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();
  const { refreshMatchBadge, refreshProfileBadge } = useNotifications();
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  const isExpoGo = Constants.appOwnership === 'expo';

  // Listen for incoming notifications
  useEffect(() => {
    if (isExpoGo || !Notifications) {
      return;
    }

    try {
      notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
        const data = notification.request.content.data;
        if (data?.type === 'new_match') {
          refreshMatchBadge();
        } else if (data?.type === 'new_swipe') {
          void refreshProfileBadge();
        }
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
        const data = response.notification.request.content.data;
        if (data?.type === 'new_match') {
          refreshMatchBadge();
        } else if (data?.type === 'new_swipe') {
          void refreshProfileBadge();
        }
      });
    } catch (error) {
    }

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isExpoGo, refreshMatchBadge, refreshProfileBadge]);

  if (loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isAuthenticated ? <AuthStack /> : <AuthStack />}
    </ThemeProvider>
  );
}
