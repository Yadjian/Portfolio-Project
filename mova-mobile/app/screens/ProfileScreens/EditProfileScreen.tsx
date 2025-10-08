import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../lib/types';
import { updateProfile } from '../../../services/api';

export default function EditProfileScreen() {
  const route = useRoute<RouteProp<AuthStackParamList, 'EditProfileScreen'>>();
  const { userType } = route.params;

  // Champs communs
  const [presentation, setPresentation] = useState('');

  // Champs candidat
  const [name, setName] = useState('');
  const [pronoun, setPronoun] = useState('');

  // Champs recruteur
  const [company, setCompany] = useState('');
  const [siret, setSiret] = useState('');

  const handleSubmit = async () => {
    if (userType === 'candidat' && (!name || !pronoun)) {
      return Alert.alert('Erreur', 'Nom et pronom obligatoires');
    }
    if (userType === 'recruteur' && (!company || !siret)) {
      return Alert.alert('Erreur', "Nom de l'entreprise et Siret obligatoires");
    }

    let profileData: any = { presentation };
    if (userType === 'candidat') {
      profileData.name = name;
      profileData.pronoun = pronoun;
    } else if (userType === 'recruteur') {
      profileData.company = company;
      profileData.siret = siret;
    }

    try {
      await updateProfile(profileData);
      Alert.alert('Succès', 'Profil mis à jour !');
    } catch (error) {
      Alert.alert('Erreur', 'La mise à jour a échoué.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complétez votre profil</Text>
      {userType === 'candidat' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nom (obligatoire)"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Pronom (obligatoire)"
            value={pronoun}
            onChangeText={setPronoun}
          />
        </>
      )}
      {userType === 'recruteur' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nom de l'entreprise (obligatoire)"
            value={company}
            onChangeText={setCompany}
          />
          <TextInput
            style={styles.input}
            placeholder="Numéro de Siret (obligatoire)"
            value={siret}
            onChangeText={setSiret}
            keyboardType="numeric"
          />
        </>
      )}
      <TextInput
        style={styles.input}
        placeholder="Présentation (optionnel)"
        value={presentation}
        onChangeText={setPresentation}
        multiline
      />
      <Button title="Enregistrer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8, borderRadius: 6 },
});