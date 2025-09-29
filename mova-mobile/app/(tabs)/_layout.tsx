import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" // Fichier app/(tabs)/index.tsx
        options={{ title: 'Swipe' }}
      />
      <Tabs.Screen
        name="matches" // Fichier app/(tabs)/matches.tsx
        options={{ title: 'Matchs' }}
      />
      <Tabs.Screen
        name="profile" // Fichier app/(tabs)/profile.tsx
        options={{ title: 'Profil' }}
      />
    </Tabs>
  );
}
