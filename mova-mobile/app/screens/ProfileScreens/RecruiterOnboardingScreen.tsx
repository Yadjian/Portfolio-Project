import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';

const { height, width } = Dimensions.get('window');

export default function RecruiterOnboardingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur votre profil recruteur !</Text>
      <Text style={styles.subtitle}>Que souhaitez-vous faire ?</Text>
      <Pressable
        style={[styles.button, { backgroundColor: '#07b9ff' }]}
        onPress={() => navigation.navigate('CreateCompany')}
      >
        <Text style={styles.buttonText}>Créer mon entreprise</Text>
      </Pressable>
      <View style={{ marginVertical: 20 }} />
      <Pressable
        style={[styles.button, { backgroundColor: '#6b25f9' }]}
        onPress={() => navigation.navigate('JoinCompany')}
      >
        <Text style={styles.buttonText}>Rejoindre une entreprise existante</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#6746a8', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, color: '#6746a8', marginBottom: 40, textAlign: 'center' },
  button: { width: '80%', borderRadius: 25, alignSelf: 'center', paddingVertical: height * 0.03, marginBottom: 10 },
  buttonText: { color: '#fff', fontSize: width * 0.045, fontWeight: 'bold', textAlign: 'center' },
});