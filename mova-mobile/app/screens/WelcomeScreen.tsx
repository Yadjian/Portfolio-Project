import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';
import GenericButton from '@/components/ui/GenericButton';

// Récupère les dimensions de l'écran
const { height, width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Conteneur pour le logo */}
      <View style={styles.logoContainer}>
        <MovaLogo size={height * 0.18} />
        <Text style={styles.slogan}>
          Votre prochain emploi{'\n'}commence par une rencontre !
        </Text>
      </View>

      {/* Conteneur pour les boutons */}
      <View style={styles.buttonContainer}>
        <GenericButton
          title="Connexion"
          onPress={() => navigation.navigate('Login')}
          style={styles.button} // Applique une largeur commune
        />
        <View style={{ marginVertical: height * 0.02 }} /> {/* Espacement dynamique */}
        <GenericButton
          title="Créer mon compte"
          onPress={() => navigation.navigate('Register')}
          style={styles.button} // Applique une largeur commune
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: height * 0.15,
  },
  logoContainer: {
    alignItems: 'center', // Centre le logo horizontalement
    marginTop: height * 0.1, // Réduit à 10% de la hauteur de l'écran
  },
  slogan: {
    marginTop: height * 0.025, // 2.5% de la hauteur au lieu de 18px fixe
    fontSize: width * 0.045, // 4.5% de la largeur au lieu de 18px fixe
    color: '#6746a8',
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: width * 0.06, // 6% de la largeur au lieu de 24px fixe
  },
  buttonContainer: {
    justifyContent: 'flex-start', // Aligne les boutons en haut du conteneur
    alignItems: 'center', // Centre les boutons horizontalement
    marginTop: height * 0.06, // Ajoute un espacement au-dessus des boutons
    paddingHorizontal: width * 0.05, // Ajoute un padding latéral pour éviter que les boutons touchent les bords
  },
  button: {
    width: width * 0.8, // Largeur commune pour tous les boutons (80% de la largeur de l'écran)
  },
});