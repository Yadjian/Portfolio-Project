import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';
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
        <View style={styles.content}>
          <Text style={styles.title}>Je suis...</Text>
          <Pressable
            style={[styles.button, { backgroundColor: '#07b9ff' }]}
            onPress={() => navigation.navigate('CandidateProfile')}
          >
            <Text style={styles.buttonText}>Candidat</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: '#6b25f9' }]}
            onPress={() => navigation.navigate('RecruiterProfile')}
          >
            <Text style={styles.buttonText}>Recruteur</Text>
          </Pressable>
        </View>
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '65%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffffff',
    marginBottom: '15%',
  },
  button: {
    borderRadius: 30,
    width: '80%',
    paddingVertical: '7%',
    marginBottom: '10%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});