import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import { createCompany } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';

const { height, width } = Dimensions.get('window');

export default function CreateCompanyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [companyName, setCompanyName] = useState('');
  const [siret, setSiret] = useState('');

  const handleSubmit = async () => {
    if (!companyName || !siret) {
      alert("Nom de l'entreprise et numéro de Siret obligatoires.");
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
      <Text style={styles.title}>Créer mon entreprise</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom de l'entreprise"
        value={companyName}
        onChangeText={setCompanyName}
      />
      <TextInput
        style={styles.input}
        placeholder="Numéro de Siret"
        value={siret}
        onChangeText={setSiret}
        keyboardType="numeric"
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Créer</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#6746a8' },
  input: { width: '80%', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 20, backgroundColor: '#fff' },
  button: { backgroundColor: '#07b9ff', borderRadius: 25, paddingVertical: height * 0.03, width: '80%' },
  buttonText: { color: '#fff', fontSize: width * 0.045, fontWeight: 'bold', textAlign: 'center' },
});