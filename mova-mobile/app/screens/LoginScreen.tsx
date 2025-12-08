import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Keyboard, Alert, ActivityIndicator, useWindowDimensions } from 'react-native';
import MovaLogo from '../../components/ui/MovaLogo';
import { Ionicons } from '@expo/vector-icons';
import { login, getMyProfile } from '../../services/api';

/**
 * LoginScreen
 *
 * This screen allows users to log in to their account.
 * 
 * Main features:
 * - Handles form state for email and password.
 * - Allows toggling password visibility.
 * - Validates required fields before submitting.
 * - Calls the backend to authenticate the user.
 * - Fetches the user's profile after login to determine their type (candidate or recruiter).
 * - Redirects to the appropriate profile screen after successful login.
 * - Handles loading and error states.
 * - Provides navigation to registration and password reset.
 * 
 * Key logic:
 * - Uses React state for form and loading.
 * - Listens for keyboard events to adjust UI.
 * - Uses Alert for error messages.
 */

export default function LoginScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Listen for keyboard show/hide events to adjust UI if needed
  React.useEffect(() => {
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

  // Handle login form submission
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    try {
      // 1. Login and store tokens via API service
      await login(email, password);

      // 2. Fetch profile for redirection
      const profileData = await getMyProfile();

      // 3. Navigate based on profile type
      if (profileData.candidateProfile) {
        navigation.replace('CandidateProfile', { userType: 'candidate' });
      } else if (profileData.recruiterProfile) {
        navigation.replace('RecruiterProfile', { userType: 'recruiter' });
      } else {
        // This can happen if the user has an account but hasn't completed their profile yet.
        // For now, treat as an error.
        throw new Error("Profil utilisateur introuvable ou type non reconnu.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      Alert.alert('Erreur de connexion', errorMessage);
    } finally {
      setLoading(false);
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
        scrollEnabled={keyboardVisible}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with logo and title */}
        <View style={styles.header}>
          <MovaLogo />
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Heureux de vous revoir !
          </Text>
        </View>

        {/* Login form card */}
        <View style={styles.formCard}>
          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="exemple@email.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Votre mot de passe"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              {/* Toggle password visibility */}
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Footer links for registration and password reset */}
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('ChooseRegisterType')}>
              <Text style={styles.footerLink}>Créer un compte</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { /* TODO: navigation.navigate('ForgotPassword') */ }}>
              <Text style={styles.footerLink}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Styles for the LoginScreen component
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
  },
  formCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#4930a3',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerLink: {
    fontSize: 14,
    color: '#4930a3',
    fontWeight: '600',
  },
});