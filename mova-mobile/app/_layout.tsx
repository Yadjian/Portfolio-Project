import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AuthStack from './navigation/AuthStack';
import { DancingScript_700Bold } from '@expo-google-fonts/dancing-script';

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