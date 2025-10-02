import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Récupère les dimensions de l'écran
const { width, height } = Dimensions.get('window');

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
        colors={gradientColors} // Utilise les couleurs passées en props ou les couleurs par défaut
        style={[styles.button, style]} // Combine les styles par défaut et personnalisés
        start={{ x: 0, y: 0 }} // Début du dégradé
        end={{ x: 1, y: 0 }} // Fin du dégradé
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: height * 0.02, // Hauteur dynamique (2% de la hauteur de l'écran)
    paddingHorizontal: width * 0.05, // Largeur interne dynamique (5% de la largeur de l'écran)
    borderRadius: width * 0.05, // Coins arrondis dynamiques (5% de la largeur de l'écran)
    width: width * 0.6, // Largeur dynamique (60% de la largeur de l'écran)
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045, // Taille du texte dynamique (4.5% de la largeur de l'écran)
    fontWeight: 'bold',
  },
});