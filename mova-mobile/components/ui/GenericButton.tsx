import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GenericButtonProps {
  title: string; // Texte du bouton
  onPress: () => void; // Fonction appelée lors du clic
  style?: ViewStyle; // Style personnalisé pour le bouton
  textStyle?: TextStyle; // Style personnalisé pour le texte
  gradientColors?: string[]; // Couleurs du dégradé
}

export default function GenericButton({
  title,
  onPress,
  style,
  textStyle,
  gradientColors = ['#6746a8', '#6b25f9', '#07b9ff'], // Couleurs par défaut
}: GenericButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#6746a8', '#6b25f9', '#07b9ff']} // Dégradé violet-bleu
        style={[styles.button, style]} // Combine les styles par défaut et personnalisés
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
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});