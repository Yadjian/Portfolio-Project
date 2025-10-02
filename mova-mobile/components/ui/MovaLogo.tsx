import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Récupère les dimensions de l'écran
const { width, height } = Dimensions.get('window');

export default function MovaLogo() {
  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']} // Dégradé violet-bleu
      style={styles.titleContainer}
      start={{ x: 0, y: 0 }} // Point de départ (gauche)
      end={{ x: 1, y: 0 }}   // Point de fin (droite)
    >
      <Text style={styles.title}>Mova</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    borderWidth: 1.5, // Réduit l'épaisseur de la bordure
    borderColor: '#FFFFFF', // Couleur de la bordure
    backgroundColor: '#5c00e7', // Couleur de fond
    borderRadius: width * 0.15, // Coins arrondis ajustés (15% de la largeur)
    width: width * 0.25, // Largeur dynamique (25% de la largeur de l'écran)
    height: width * 0.25, // Hauteur égale à la largeur pour un cercle parfait
    alignItems: 'center', // Centre le texte horizontalement
    justifyContent: 'center', // Centre le texte verticalement
  },
  title: {
    fontSize: width * 0.04, // Taille du texte dynamique (4% de la largeur de l'écran)
    fontWeight: 'bold', // Texte en gras
    color: '#FFFFFF', // Couleur blanche
  },
});