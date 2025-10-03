import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';
import GenericButton from '@/components/ui/GenericButton';

const { height, width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MovaLogo />
        <Text style={styles.slogan}>
          Votre prochain emploi{'\n'}commence par une rencontre !
        </Text>
        <View style={styles.separator} /> {/* Séparateur ajouté ici */}
      </View>

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
    paddingTop: height * 0.08,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  slogan: {
    marginTop: height * 0.05,
    fontSize: width * 0.055,
    color: '#6746a8',
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: width * 0.06,
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginVertical: 18,
    borderRadius: 1,
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: height * 0.06,
    paddingHorizontal: width * 0.05,
  },
});