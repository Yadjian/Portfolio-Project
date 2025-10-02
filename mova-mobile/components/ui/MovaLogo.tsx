import React from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Récupère les dimensions de l'écran
const { width, height } = Dimensions.get('window');

export default function MovaLogo() {
  return (
    <LinearGradient
      colors={['#6746a8ff', '#6b25f9ff', '#07b9ffff']} // Dégradé violet-bleu
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
    borderColor: '#ffffffff', // Couleur de la bordure
    backgroundColor: '#5c00e7ff', // Couleur de fond
    borderRadius: width * 0.2, // Arrondi basé sur la largeur de l'écran
    width: width * 0.35, // Largeur dynamique (40% de la largeur de l'écran)
    height: height * 0.14, // Hauteur dynamique (10% de la hauteur de l'écran)
    marginBottom: height * 0.02, // Espacement sous le logo (2% de la hauteur de l'écran)
    alignItems: 'center', // Centre le texte horizontalement
    justifyContent: 'center', // Centre le texte verticalement
  },
  title: {
    fontSize: width * 0.08, // Taille du texte dynamique (8% de la largeur de l'écran)
    fontWeight: 'bold', // Texte en gras
    color: '#FFFFFF', // Couleur blanche
  },
});