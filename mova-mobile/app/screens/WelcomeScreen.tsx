import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';
import GenericButton from '@/components/ui/GenericButton';

// Récupère la hauteur de l'écran
const { height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Conteneur pour le logo */}
      <View style={styles.logoContainer}>
        <MovaLogo />
      </View>

      {/* Conteneur pour les boutons */}
      <View style={styles.buttonContainer}>
        <GenericButton
          title="Connexion"
          onPress={() => navigation.navigate('Login')}
        />
        <View style={{ marginVertical: 20 }} />
        <GenericButton
          title="Créer mon compte"
          onPress={() => navigation.navigate('Register')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center', // Centre le logo horizontalement
    marginTop: height * 0.15, // 10% de la hauteur de l'écran
  },
  buttonContainer: {
    flex: 1, // Prend tout l'espace restant
    justifyContent: 'flex-start', // Aligne les boutons en haut du conteneur
    alignItems: 'center', // Centre les boutons horizontalement
    marginTop: height * 0.2, // 20% de la hauteur de l'écran
  },
});