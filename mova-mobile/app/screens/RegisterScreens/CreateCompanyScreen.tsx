import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, KeyboardAvoidingView, Platform, ScrollView, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import { createCompany } from '../../../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import MovaLogo from '../../../components/ui/MovaLogo';
import { Ionicons } from '@expo/vector-icons';

const { height, width } = Dimensions.get('window');

/**
 * CreateCompanyScreen
 *
 * This screen allows a recruiter to register a new company.
 *
 * Main features:
 * - Displays a form for entering company name and SIRET number.
 * - Handles form state, input validation, and keyboard events.
 * - Calls the backend to create the company with the provided info.
 * - Navigates to the recruiter profile edit screen upon success.
 * - Shows the app logo and a styled submit button.
 *
 * Key logic:
 * - Uses React state for form fields and keyboard visibility.
 * - Handles form submission and error display.
 * - Uses KeyboardAvoidingView and ScrollView for mobile UX.
 */

export default function CreateCompanyScreen({ route }: { route: RouteProp<AuthStackParamList, 'CreateCompany'> }) {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [companyName, setCompanyName] = useState('');
  const [siret, setSiret] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Listen for keyboard show/hide events to adjust UI if needed
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  // Handle form submission and company creation
  const handleSubmit = async () => {
    if (!companyName || !siret) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    const { userId } = route.params;

    try {
      await createCompany({ companyName, siret });
      navigation.navigate('EditProfileScreen', { userType: 'recruiter', userId, companyName, startEditing: true });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inattendue est survenue.";
      console.error("Erreur lors de la création de l'entreprise:", errorMessage);
      alert(`Erreur: ${errorMessage}`);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={keyboardVisible ? styles.scrollContent : styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with logo and title */}
        <View style={styles.header}>
          <MovaLogo />
          <Text style={styles.title}>Créez votre entreprise</Text>
          <Text style={styles.subtitle}>
            Renseignez les informations de votre société.
          </Text>
        </View>

        {/* Company registration form card */}
        <View style={styles.formCard}>
          {/* Company name input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Raison Sociale</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nom de votre entreprise"
                placeholderTextColor="#999"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>
          </View>

          {/* SIRET number input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Numéro SIRET</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="barcode-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="14 chiffres"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={siret}
                onChangeText={setSiret}
                maxLength={14}
              />
            </View>
          </View>

          {/* Submit button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles for the CreateCompanyScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4930a3',
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#6746a8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#4930a3',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#4930a3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});