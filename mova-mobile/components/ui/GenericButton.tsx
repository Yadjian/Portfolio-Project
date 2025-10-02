import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Layout from '@/constants/Layout'; // Import des dimensions dynamiques

interface GenericButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: string[];
}

export default function GenericButton({
  title,
  onPress,
  style,
  textStyle,
  gradientColors = ['#6746a8', '#6b25f9', '#07b9ff'],
}: GenericButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#6746a8', '#6b25f9', '#07b9ff']}
        style={[styles.button, style]}
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
    paddingVertical: Layout.window.height * 0.02, // 2% de la hauteur de l'écran
    paddingHorizontal: Layout.window.width * 0.05, // 5% de la largeur de l'écran
    borderRadius: Layout.window.width * 0.05, // Coins arrondis dynamiques
    width: Layout.window.width * 0.8, // Largeur dynamique (80% de la largeur de l'écran)
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Layout.window.height * 0.02, // Espacement vertical dynamique
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: Layout.window.width * 0.045, // Taille du texte dynamique
    fontWeight: 'bold',
  },
});