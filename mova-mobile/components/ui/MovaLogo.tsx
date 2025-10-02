import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
    borderWidth: 2,
    borderColor: '#ffffffff',
    backgroundColor: '#5c00e7ff',
    borderRadius: 200,
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});