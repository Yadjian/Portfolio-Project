import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';

const { height, width } = Dimensions.get('window');

export default function ChooseRegisterTypeScreen({ navigation }: any) {
  const handleAuth0Signup = (role: 'candidat' | 'recruteur') => {
    if (role === 'candidat') navigation.navigate('CandidateProfile');
    else navigation.navigate('RecruiterProfile');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MovaLogo />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Je suis...</Text>
        <Pressable
          style={[styles.button, { backgroundColor: '#07b9ff' }]}
          onPress={() => handleAuth0Signup('candidat')}
        >
          <Text style={styles.buttonText}>Candidat</Text>
        </Pressable>
        <View style={{ marginVertical: 20 }} />
        <Pressable
          style={[styles.button, { backgroundColor: '#6b25f9' }]}
          onPress={() => handleAuth0Signup('recruteur')}
        >
          <Text style={styles.buttonText}>Recruteur</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: height * 0.08,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05, 
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.04,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6746a8',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    borderRadius: 25,
    alignSelf: 'center',
    paddingVertical: height * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});