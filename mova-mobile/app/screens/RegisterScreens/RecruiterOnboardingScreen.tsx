import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import MovaLogo from '../../../components/ui/MovaLogo';

const { height, width } = Dimensions.get('window');

export default function RecruiterOnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MovaLogo />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Que souhaitez-vous ?</Text>
        <Pressable
          style={[styles.button, { backgroundColor: '#07b9ff' }]}
          onPress={() => navigation.navigate('CreateCompany')}
        >
          <Text style={styles.buttonText}>Inscrire mon entreprise</Text>
        </Pressable>
        <View style={{ marginVertical: 20 }} />
        <Pressable
          style={[styles.button, { backgroundColor: '#6b25f9' }]}
          onPress={() => navigation.navigate('JoinCompany')}
        >
          <Text style={styles.buttonText}>Rejoindre une entreprise</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.1,
    marginTop: height * 0.05,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
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