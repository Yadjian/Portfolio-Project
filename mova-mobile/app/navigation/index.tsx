import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppTabs from './AppTabs';

export { default as AuthStack } from './AuthStack';
export { default as AppTabs } from './AppTabs';

export default function Navigation() {
  return (
    <NavigationContainer>
      {/* Exemple : Utilise AuthStack ou AppTabs selon l'état d'authentification */}
      <AuthStack />
      {/* <AppTabs /> */}
    </NavigationContainer>
  );
}