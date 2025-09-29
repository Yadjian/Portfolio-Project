import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';

// Pour simuler l'authentification
const isSignedIn = true; // <-- CHANGEZ CETTE VALEUR (true/false) POUR TESTER

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      // Redirige vers le premier onglet si l'utilisateur est connecté
      // mais se trouve encore sur un écran d'authentification.
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup) {
      // Redirige vers l'écran de connexion si l'utilisateur n'est PAS connecté
      // et n'est pas déjà dans le groupe d'authentification.
      router.replace('/(auth)/login');
    }
  }, [isSignedIn, segments]);


  return <Slot />;
}
