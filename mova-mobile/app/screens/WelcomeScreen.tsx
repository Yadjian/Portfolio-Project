import React from 'react';
import { StyleSheet, View } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';
import GenericButton from '@/components/ui/GenericButton';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <MovaLogo />

      {/* Bouton Connexion */}
      <GenericButton
        title="Connexion"
        onPress={() => navigation.navigate('Login')}
      />

      {/* Espacement entre les boutons */}
      <View style={{ marginVertical: 10 }} />

      {/* Bouton Créer mon compte */}
      <GenericButton
        title="Créer mon compte"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});