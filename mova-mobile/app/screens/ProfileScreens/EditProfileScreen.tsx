import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../lib/types';
import { updateProfile } from '../../../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';

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
    // Restriction désactivée pour les tests
    // if (userType === 'candidat' && (!name || !pronoun)) {
      // return Alert.alert('Erreur', 'Nom et pronom obligatoires');
    // }
    // if (userType === 'recruteur' && (!company || !siret)) {
      // return Alert.alert('Erreur', "Nom de l'entreprise et Siret obligatoires");
    // }

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
          <Text style={styles.buttonText}>Enregistrer</Text>
        </Pressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 8, borderRadius: 6 },
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
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});