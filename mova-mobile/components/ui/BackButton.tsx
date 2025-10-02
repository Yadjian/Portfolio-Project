import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface BackButtonProps {
  onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#6746a8" />
            <Stop offset="50%" stopColor="#6b25f9" />
            <Stop offset="100%" stopColor="#07b9ff" />
          </LinearGradient>
        </Defs>
        <Path
          d="M26 16H10 M16 22L10 16L16 10" // Ligne horizontale et tête de flèche ajustées
          stroke="url(#grad)" // Applique le dégradé ici
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10, // Espacement pour rendre le bouton cliquable
  },
});