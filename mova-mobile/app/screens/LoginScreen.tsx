import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from 'react-native';
import GradientBackground from '@/components/ui/ColorBackground';
import CustomTextInput from '../../components/ui/TextInput';
import CustomCard from '../../components/ui/WhiteFrame';
import MovaLogo from '../../components/ui/MovaLogo';
import GenericButton from '@/components/ui/GenericButton';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { height, width } = useWindowDimensions();

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          {
            padding: width * 0.05,
            paddingTop: height * 0.04,
          },
        ]}
      >
        {/* Titre avec dégradé */}
        <View style={{ marginBottom: height * 0.02 }}>
          <MovaLogo />
        </View>

        {/* Formulaire de connexion */}
        <CustomCard>
          <Text
            style={{
              fontSize: width * 0.07,
              fontWeight: 'bold',
              color: '#6746a8',
              textAlign: 'center',
              marginBottom: height * 0.04,
            }}
          >
            Connexion
          </Text>
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

          {/* Deux textes cliquables sur la même ligne */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: height * 0.01,
            }}
          >
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text
                style={{
                  color: '#6746a8',
                  fontSize: width * 0.033,
                }}
              >
                Créer mon compte
              </Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
              <Text
                style={{
                  color: '#6746a8',
                  fontSize: width * 0.033,
                }}
              >
                Mot de passe oublié ?
              </Text>
            </Pressable>
          </View>

          <GenericButton
            title="Se connecter"
            onPress={() => console.log('Login pressed')}
            style={{
              width: width * 0.4,
              height: height * 0.06,
              marginTop: height * 0.08,
              alignSelf: 'center',
            }}
            textStyle={{
              fontSize: width * 0.045,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});