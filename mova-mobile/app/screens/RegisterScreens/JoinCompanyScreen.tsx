import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Pressable } from 'react-native';
import { joinCompany } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import MovaLogo from '../../../components/ui/MovaLogo';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

/**
 * JoinCompanyScreen
 *
 * This screen allows a recruiter to join an existing company using its SIRET number.
 *
 * Main features:
 * - Displays a form for entering the SIRET number of the company.
 * - Handles form state and input validation.
 * - Calls the backend to join the company with the provided SIRET.
 * - Navigates to the RecruiterProfile screen (in edit mode) upon success.
 * - Shows the app logo and a styled join button.
 *
 * Key logic:
 * - Uses React state for the SIRET input.
 * - Handles form submission and error logging.
 * - Uses LinearGradient for a visually appealing button.
 */

export default function JoinCompanyScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [siret, setSiret] = useState('');

  // Handle form submission and company joining
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
      {/* Logo at the top */}
      <View style={styles.logoContainer}>
        <MovaLogo />
      </View>
      <View style={styles.content}>
        {/* Title and SIRET input */}
        <Text style={styles.title}>Indiquez le Numéro SIRET</Text>
        <TextInput
          style={styles.input}
          placeholder="Numéro SIRET"
          value={siret}
          onChangeText={setSiret}
          keyboardType="numeric"
        />
        {/* Join button with gradient background */}
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
            <Text style={styles.buttonText}>Rejoindre</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}

// Styles for the JoinCompanyScreen component
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