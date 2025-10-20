import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientBackgroundProps {
  children: React.ReactNode; // Contenu à afficher dans le dégradé
  style?: ViewStyle; // Style personnalisé pour le conteneur
}

export default function GradientBackground({ children, style }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']} // Couleurs du dégradé
      start={{ x: 0, y: 0 }} // Début du dégradé
      end={{ x: 1, y: 0 }} // Fin du dégradé
      style={[styles.gradientBackground, style]} // Combine les styles par défaut et personnalisés
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1, // Prend tout l'espace disponible
  },
});