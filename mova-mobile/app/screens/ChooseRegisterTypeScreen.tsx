import React from 'react';
import { View, Text, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';
// Si tu utilises Auth0, importe le SDK ici
// import Auth0 from 'react-native-auth0';
// const auth0 = new Auth0({ domain: 'TON_DOMAINE.auth0.com', clientId: 'TON_CLIENT_ID' });

export default function ChooseRegisterTypeScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const buttonWidth = width * 0.85;
  const buttonRadius = height * 0.05;
  const buttonPaddingVertical = height * 0.03;
  const buttonMarginVertical = height * 0.01;

  // Fonction pour lancer Auth0 (remplace navigation si tu utilises Auth0)
  const handleAuth0Signup = (role: 'candidat' | 'recruteur') => {
    // auth0.webAuth.authorize({ scope: 'openid profile email', prompt: 'login', /* ...autres params... */ });
    // Tu peux passer le rôle en paramètre si besoin
  };

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <View style={{ marginBottom: height * 0.02, marginTop: height * 0.04, alignItems: 'center' }}>
        <MovaLogo />
      </View>
      <Text
        style={{
          fontSize: width * 0.07,
          fontWeight: 'bold',
          color: '#6746a8',
          textAlign: 'center',
          marginBottom: height * 0.08,
          borderRadius: 25,
          paddingVertical: height * 0.04,
          paddingHorizontal: width * 0.09,
          marginVertical: height * 0.02,
        }}
      >
        Je suis ici pour...
      </Text>
      <Pressable
        style={{
          backgroundColor: '#07b9ff',
          borderRadius: buttonRadius,
          width: buttonWidth,
          paddingVertical: buttonPaddingVertical,
          elevation: 2,
          marginBottom: height * 0.03,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        // Si tu utilises Auth0, remplace navigation par handleAuth0Signup('candidat')
        onPress={() => {
          // navigation.navigate('RegisterCandidate');
          handleAuth0Signup('candidat');
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: width * 0.05,
            fontWeight: 'bold',
          }}
        >
          Candidater
        </Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: '#6b25f9',
          borderRadius: buttonRadius,
          width: buttonWidth,
          paddingVertical: buttonPaddingVertical,
          elevation: 2,
          marginVertical: buttonMarginVertical,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        // Si tu utilises Auth0, remplace navigation par handleAuth0Signup('recruteur')
        onPress={() => {
          // navigation.navigate('RegisterRecruiter');
          handleAuth0Signup('recruteur');
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: width * 0.05,
            fontWeight: 'bold',
          }}
        >
          Recruter
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});