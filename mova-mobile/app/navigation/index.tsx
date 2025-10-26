import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { useColorScheme } from '@/components/useColorScheme';

export { default as AuthStack } from './AuthStack';
export { default as AppTabs } from './AppTabs';

/**
 * Navigation
 *
 * Main entry point for app navigation.
 *
 * Main features:
 * - Wraps the app in a NavigationContainer.
 * - Chooses between authentication stack (login/register) and main app tabs based on authentication state.
 * - Applies dark or light theme based on user preference.
 *
 * Key logic:
 * - Uses useColorScheme to detect theme.
 * - Uses a boolean (isAuthenticated) to switch between AuthStack and AppTabs.
 *   (In production, isAuthenticated should come from app state/context.)
 */

// Navigation component that wraps the app in a navigation container
// Switches between AuthStack (login/register) and AppTabs (main app) depending on authentication
export default function Navigation() {
  const colorScheme = useColorScheme();
  const isAuthenticated = false; // Set to true if user is logged in

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Show main app tabs if authenticated, otherwise show authentication stack */}
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}