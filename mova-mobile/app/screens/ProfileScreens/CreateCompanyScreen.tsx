import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import { createCompany } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import MovaLogo from '../../../components/ui/MovaLogo';
import { LinearGradient } from 'expo-linear-gradient';
import GenericInputBar from '../../../components/ui/TextInput';

const { height, width } = Dimensions.get('window');

export default function CreateCompanyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [companyName, setCompanyName] = useState('');
  const [siret, setSiret] = useState('');

  const handleSubmit = async () => {
    try {
      // await createCompany({ companyName, siret });
      navigation.navigate('EditProfileScreen', { userType: 'recruteur' });
    } catch (error) {
      console.error(error);
      // alert("Erreur lors de la création de l'entreprise.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.content}>
          <MovaLogo sizeProp={60} />
          <Text style={styles.title}>Inscription</Text>
          <GenericInputBar
            placeholder="Raison Sociale"
            value={companyName}
            onChangeText={setCompanyName}
            style={{ width: width * 0.55 }} 
          />
          <GenericInputBar
            placeholder="Numéro SIRET"
            value={siret}
            onChangeText={setSiret}
            keyboardType="numeric"
            style={{ width: width * 0.55 }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'flex-start',
  },
  card: {
    flex: 1, // la card prend toute la hauteur dispo
    backgroundColor: '#fff',
    borderRadius: width * 0.045,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.06,
    marginVertical: height * 0.02, // même marge en haut et en bas
    marginHorizontal: width * 0.03,
    shadowColor: '#6746a8',
    shadowOpacity: 0.08,
    shadowRadius: width * 0.03,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 40, // espace sous le logo réduit
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
    width: width * 0.55,
    borderRadius: 25,
    alignSelf: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 40,
    marginBottom: 45, // <-- ajoute ou augmente cette ligne pour plus d'espace sous le bouton
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