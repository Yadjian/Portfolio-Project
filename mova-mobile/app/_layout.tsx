import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthStack from './navigation/AuthStack';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';
import * as ExpoCrypto from 'expo-crypto';

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
      <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, loading } = useAuth();

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