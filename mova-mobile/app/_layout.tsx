import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { NotificationProvider, useNotifications } from '../contexts/NotificationContext';
import AuthStack from './navigation/AuthStack';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import * as ExpoCrypto from 'expo-crypto';
import Constants from 'expo-constants';

// Import conditionnel de expo-notifications pour éviter les erreurs dans Expo Go
const isExpoGoApp = Constants.appOwnership === 'expo';
let Notifications: any = null;

if (!isExpoGoApp) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    Notifications = require('expo-notifications');
    console.log('✅ [_layout] Module expo-notifications chargé');
  } catch (error) {
    console.warn('⚠️ [_layout] Impossible de charger expo-notifications:', error);
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

// Polyfill global.crypto.getRandomValues — doit être exécuté en tout premier
if (!global.crypto) {
  const getRandomValues = <T extends ArrayBufferView>(array: T): T => {
    const byteView = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);

    // Guard and call via `any` to satisfy TS/typing differences
    if ('assertByteCount' in ExpoCrypto) {
      (ExpoCrypto as any).assertByteCount?.(byteView.length);
    }

    const bytes = (ExpoCrypto as any).getRandomBytes
      ? (ExpoCrypto as any).getRandomBytes(byteView.length)
      : // fallback to Math.random if expo crypto doesn't expose getRandomBytes
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
    DancingScript_700Bold,
    ...FontAwesome.font, // Police pour les icônes
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

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();
  const { refreshMatchBadge, refreshProfileBadge } = useNotifications();
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // Vérifier si on est dans Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';

  // Setup notification listeners (seulement si pas dans Expo Go)
  useEffect(() => {
    if (isExpoGo || !Notifications) {
      console.log('ℹ️ [_layout] Mode simulation - Listeners de notifications désactivés');
      return;
    }

    try {
      // Listener quand une notification arrive en foreground
      notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
        console.log('🔔 [_layout] Notification reçue en foreground:', notification);
        const data = notification.request.content.data;
        
        // Rafraîchir les badges selon le type de notification
        if (data?.type === 'new_match') {
          console.log('❤️ [_layout] Nouveau match détecté, rafraîchissement du badge');
          refreshMatchBadge();
        } else if (data?.type === 'new_swipe') {
          console.log('👍 [_layout] Nouveau swipe détecté, rafraîchissement du badge');
          // On ne passe pas de currentProfileCount, la fonction ira le chercher
          void refreshProfileBadge();
        }
      });

      // Listener quand l'utilisateur clique sur une notification
      responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log('👆 [_layout] Notification cliquée:', response);
        const data = response.notification.request.content.data;
        
        // TODO: Navigation vers la bonne page selon le type
        // Pour l'instant on rafraîchit juste les badges
        if (data?.type === 'new_match') {
          refreshMatchBadge();
        } else if (data?.type === 'new_swipe') {
          void refreshProfileBadge();
        }
      });
    } catch (error) {
      console.error('❌ [_layout] Erreur lors de la configuration des listeners:', error);
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

  // Afficher un écran de chargement pendant la vérification de l'auth
  if (loading) {
    return null; // Tu peux remplacer par un composant de loading
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* 
        Cette logique est la clé :
        - Si l'utilisateur n'est PAS authentifié, on affiche le AuthStack (Login, Register, etc.)
        - Si l'utilisateur EST authentifié, on le redirige vers son profil (géré par AuthStack après la connexion)
      */}
      {isAuthenticated ? <AuthStack /> : <AuthStack />}
    </ThemeProvider>
  );
}