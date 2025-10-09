import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Pressable } from 'react-native';
import { createCompany } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import MovaLogo from '../../../components/ui/MovaLogo';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

export default function CreateCompanyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [companyName, setCompanyName] = useState('');
  const [siret, setSiret] = useState('');

  const handleSubmit = async () => {
    if (!companyName || !siret) {
      alert("Les champs Raison Sociale et Numéro SIRET sont obligatoires.");
      return;
    }
    try {
      await createCompany({ companyName, siret });
      navigation.navigate('RecruiterProfile', { startEditing: true });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création de l'entreprise.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MovaLogo />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Inscription</Text>
        <TextInput
          style={styles.input}
          placeholder="Raison Sociale"
          value={companyName}
          onChangeText={setCompanyName}
        />
        <TextInput
          style={styles.input}
          placeholder="Numéro SIRET"
          value={siret}
          onChangeText={setSiret}
          keyboardType="numeric"
        />
        <LinearGradient
          colors={['#6746a8', '#6b25f9', '#07b9ff']}
          style={styles.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Pressable
            style={styles.pressable}
            onPress={handleSubmit}
            android_ripple={{ color: '#6b25f9' }}
          >
            <Text style={styles.buttonText}>Créer</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffffffb',
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
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: width * 0.045,
  },
  button: {
    width: '60%',
    borderRadius: 30,
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 10,
  },
  pressable: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});