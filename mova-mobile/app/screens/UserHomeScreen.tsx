import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../lib/types';
import MovaLogo from '../../components/ui/MovaLogo';
import Colors from '../../constants/Colors';

/**
 * UserHomeScreen
 *
 * This screen is shown after login and acts as a simple home/dashboard for authenticated users.
 * 
 * Main features:
 * - Welcomes the user and displays the app slogan.
 * - Provides a button to return to the user's profile (candidate or recruiter).
 * - Provides a logout button.
 * - Refreshes user data every time the screen is focused.
 * 
 * Key logic:
 * - Uses the AuthContext to access user info and logout/refresh functions.
 * - Navigates to the correct profile screen based on user type.
 * - Handles navigation and logout actions.
 */

export default function UserHomeScreen() {
  const { logout, user, refreshUser } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { height, width } = useWindowDimensions();

  // Refresh user data every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      refreshUser();
    }, [])
  );

  // Handle logout action
  const handleLogout = () => {
    logout();
    navigation.navigate('Home');
  };

  // Handle navigation to the user's profile (candidate or recruiter)
  const handleGoToProfile = () => {
    if (user?.candidateProfile) {
      navigation.navigate('CandidateProfile', { startEditing: false });
    } else if (user?.recruiterProfile) {
      navigation.navigate('RecruiterProfile', { startEditing: false });
    } else {
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingHorizontal: width * 0.05 }]}>
        <View style={[styles.header, { marginBottom: height * 0.12 }]}>
          <MovaLogo />
          <Text style={[styles.slogan, { 
            fontSize: Math.min(width * 0.055, 24),
            lineHeight: Math.min(width * 0.075, 32)
          }]}>
            Votre prochain emploi commence par une rencontre !
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGoToProfile}>
            <Text style={[styles.primaryButtonText, { fontSize: Math.min(width * 0.045, 18) }]}>
              Retourner au profil
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogout}>
            <Text style={[styles.secondaryButtonText, { fontSize: Math.min(width * 0.045, 18) }]}>
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
  },
  slogan: {
    color: Colors.light.text,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4930a3',
    borderRadius: 30,
    width: '100%',
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#4930a3',
    width: '100%',
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  secondaryButtonText: {
    color: '#4930a3',
    fontWeight: 'bold',
  },
});
