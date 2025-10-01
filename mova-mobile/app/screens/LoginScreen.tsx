import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomButton from '../../components/ui/CustomButton';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomCard from '../../components/ui/CustomCard';
import MovaLogo from '../../components/ui/MovaLogo'; // Import du composant MovaLogo

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});