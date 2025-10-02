import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ColorValue } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle; // Permet de personnaliser le style du bouton
  textStyle?: TextStyle; // Permet de personnaliser le style du texte
  colors?: readonly [ColorValue, ColorValue, ...ColorValue[]]; // Couleurs pour le dégradé
}

export default function DefautColorButton({
  title,
  onPress,
  style,
  textStyle,
  colors = ['#6746a8', '#6b25f9', '#07b9ff'], // Dégradé violet-bleu par défaut
}: CustomButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={colors} // Applique le dégradé
        style={[styles.button, style]} // Combine les styles par défaut et personnalisés
        start={{ x: 0, y: 0 }} // Début du dégradé (gauche)
        end={{ x: 1, y: 0 }} // Fin du dégradé (droite)
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12, // Hauteur du bouton
    paddingHorizontal: 20, // Largeur interne
    borderRadius: 20, // Coins arrondis
    alignItems: 'center', // Centrer le texte
    justifyContent: 'center', // Centrer verticalement
  },
  buttonText: {
    color: '#fff', // Couleur du texte
    fontSize: 16,
    fontWeight: 'bold',
  },
});