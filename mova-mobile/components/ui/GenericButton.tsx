import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '@/constants/Layout'; // Import des dimensions dynamiques

interface GenericButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle; // Permet de personnaliser le style du bouton
  textStyle?: TextStyle; // Permet de personnaliser le style du texte
  gradientColors?: string[]; // Permet de personnaliser les couleurs du dégradé
  borderRadius?: number; // Permet de personnaliser les coins arrondis
  paddingVertical?: number; // Permet de personnaliser le padding vertical
  paddingHorizontal?: number; // Permet de personnaliser le padding horizontal
}

export default function GenericButton({
  title,
  onPress,
  style,
  textStyle,
  gradientColors = ['#6746a8', '#6b25f9', '#07b9ff'], // Couleurs par défaut
  borderRadius = Layout.window.width * 0.08, // Coins arrondis par défaut
  paddingVertical = Layout.window.height * 0.015, // Padding vertical par défaut
  paddingHorizontal = Layout.window.width * 0.04, // Padding horizontal par défaut
}: GenericButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#6746a8', '#6b25f9', '#07b9ff']}
        style={[
          styles.button,
          {
            borderRadius,
            paddingVertical,
            paddingHorizontal,
          },
          style, // Permet de surcharger les styles depuis les props
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Layout.window.width * 0.04, // Taille du texte par défaut
    fontWeight: 'bold',
  },
});