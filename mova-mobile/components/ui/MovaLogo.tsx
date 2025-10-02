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
    borderWidth: 2, // Bordure blanche
    borderColor: '#FFFFFF', // Couleur de la bordure
    backgroundColor: '#5c00e7', // Couleur de fond
    borderRadius: width * 0.5, // Coins arrondis (10% de la largeur)
    width: width * 0.35, // Largeur dynamique (40% de la largeur de l'écran)
    height: width * 0.7 * 0.5, // Hauteur proportionnelle à la largeur (60% de la largeur)
    marginBottom: height * 0.03, // Espacement sous le logo (3% de la hauteur de l'écran)
    alignItems: 'center', // Centre le texte horizontalement
    justifyContent: 'center', // Centre le texte verticalement
  },
  title: {
    fontSize: width * 0.07, // Taille du texte dynamique (6% de la largeur de l'écran)
    fontWeight: 'bold', // Texte en gras
    color: '#FFFFFF', // Couleur blanche
  },
});