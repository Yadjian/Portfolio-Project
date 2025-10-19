import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';
import { useColorScheme } from '@/components/useColorScheme';

export { default as AuthStack } from './AuthStack';
export { default as AppTabs } from './AppTabs';

export default function Navigation() {
  const colorScheme = useColorScheme();
  const isAuthenticated = false; // Change cette valeur pour tester

  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}