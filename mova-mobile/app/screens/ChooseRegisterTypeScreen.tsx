import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';
import WhiteCard from '@/components/ui/WhiteCard';
import GradientBackground from '@/components/ui/ColorBackground';

export default function ChooseRegisterTypeScreen({ navigation }: any) {
  const handleAuth0Signup = (role: 'candidat' | 'recruteur') => {
    // auth0.webAuth.authorize({ scope: 'openid profile email', prompt: 'login' });
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <MovaLogo />
        </View>
        <WhiteCard style={{ height: '65%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.title}>Je suis ici pour ?</Text>
          <Pressable
            style={[styles.button, { backgroundColor: '#07b9ff' }]}
            onPress={() => handleAuth0Signup('candidat')}
          >
            <Text style={styles.buttonText}>Candidater</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: '#6b25f9' }]}
            onPress={() => handleAuth0Signup('recruteur')}
          >
            <Text style={styles.buttonText}>Recruter</Text>
          </Pressable>
        </WhiteCard>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: '8%',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#6746a8',
    marginBottom: '30%',
  },
  button: {
    borderRadius: 30,
    width: '90%',
    paddingVertical: '8%',
    marginBottom: '10%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});