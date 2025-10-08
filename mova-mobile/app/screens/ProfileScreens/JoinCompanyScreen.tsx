import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import { joinCompany } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';

const { height, width } = Dimensions.get('window');

export default function JoinCompanyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [siret, setSiret] = useState('');

  const handleSubmit = async () => {
    try {
      await joinCompany({ siret });
      navigation.navigate('RecruiterProfile', { startEditing: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rejoindre une entreprise existante</Text>
      <TextInput
        style={styles.input}
        placeholder="Numéro de Siret"
        value={siret}
        onChangeText={setSiret}
        keyboardType="numeric"
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Rejoindre</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, color: '#6746a8' },
  input: { width: '80%', borderWidth: 1, borderColor: '#ccc', borderRadius: 10, padding: 12, marginBottom: 20, backgroundColor: '#fff' },
  button: { backgroundColor: '#6b25f9', borderRadius: 25, paddingVertical: height * 0.03, width: '80%' },
  buttonText: { color: '#fff', fontSize: width * 0.045, fontWeight: 'bold', textAlign: 'center' },
});