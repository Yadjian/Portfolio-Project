import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import du LinearGradient
import CustomButton from '../../components/ui/DefautColorButton';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomCard from '../../components/ui/WhiteBackGround';
import MovaLogo from '../../components/ui/MovaLogo'; // Import du composant MovaLogo
import CustomBackButton from '../../components/ui/BackButton'; // Import du bouton retour

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']} // Dégradé violet-bleu
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        {/* Titre avec dégradé */}
        <MovaLogo />

        {/* Formulaire de connexion */}
        <CustomCard>
          <CustomTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <CustomTextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomButton
            title="Login"
            onPress={() => console.log('Login pressed')}
          />
          <CustomButton
            title="Go to Register"
            onPress={() => navigation.navigate('Register')}
            style={{ backgroundColor: '#03dac6', marginTop: 10 }}
          />
        </CustomCard>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1, // Prend tout l'espace disponible
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40, // Position en haut de l'écran
    left: 20, // Position à droite de l'écran
    zIndex: 1, // Assure que le bouton est au-dessus des autres éléments
  },
});