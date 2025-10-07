import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { updateProfile } from '../../../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  // On récupère le type d'utilisateur passé en paramètre
  const { userType } = (route as any).params || {};
  // Champs communs
  const [email, setEmail] = useState('');
  // Champs spécifiques
  const [name, setName] = useState('');
  const [pronoun, setPronoun] = useState('');
  const [company, setCompany] = useState('');

  const handleSubmit = async () => {
    // Prépare les données selon le type
    let profileData: any = { email };
    if (userType === 'candidat') {
      profileData.name = name;
      profileData.pronoun = pronoun;
    } else if (userType === 'recruteur') {
      profileData.company = company;
    }

    try {
      await updateProfile(profileData);
      Alert.alert('Succès', 'Profil mis à jour !');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'La mise à jour a échoué.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      {userType === 'candidat' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nom"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Pronom"
            value={pronoun}
            onChangeText={setPronoun}
          />
        </>
      )}
      {userType === 'recruteur' && (
        <TextInput
          style={styles.input}
          placeholder="Nom de l'entreprise"
          value={company}
          onChangeText={setCompany}
        />
      )}
      <Button title="Enregistrer" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8, borderRadius: 6 },
});