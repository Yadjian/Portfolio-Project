import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import GradientBackground from '@/components/ui/ColorBackground';
import CustomTextInput from '../../components/ui/TextInput';
import CustomCard from '../../components/ui/WhiteBackGround';
import MovaLogo from '../../components/ui/UIWelcomeScreen/MovaLogo';
import GenericButton from '@/components/ui/UIWelcomeScreen/GenericButton';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <GradientBackground>
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
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.createAccountText}>Mot de passe oublié ?</Text>
          </Pressable>

          <GenericButton
            title="Se connecter"
            onPress={() => console.log('Login pressed')}
            style={{
              width: 150,
              height: 40,
              marginTop: 20,
              alignSelf: 'center',
            }}
            textStyle={{
              fontSize: 14,
            }}
          />
        </CustomCard>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  createAccountText: {
    color: '#000000ff',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  },
});