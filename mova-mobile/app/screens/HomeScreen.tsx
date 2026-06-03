import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import MovaLogo from '@/components/ui/MovaLogo';
import { useAuth } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors';
import { AuthStackParamList, getApiUrl } from '@/lib/types';

/**
 * HomeScreen
 *
 * This is the landing page of the app, shown to users who are not logged in.
 *
 * Main features:
 * - Checks backend connectivity and displays the status at the top.
 * - Requests geolocation permission and periodically sends the user's location to the backend.
 * - Shows the app logo and slogan.
 * - Provides navigation to registration and login screens.
 * - Handles loading state for login.
 *
 * Key logic:
 * - Uses useEffect to check backend health on mount.
 * - Uses useEffect to request/send location every 5 minutes.
 * - Uses AuthContext to check loading state for login.
 */

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { loading } = useAuth();
  const { height, width } = useWindowDimensions();

  // Request geolocation permission and send location periodically
  useEffect(() => {
    let interval: number;

    const askAndSendLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({});
      } catch (error) {
      }
    };

    askAndSendLocation();
    interval = setInterval(askAndSendLocation, 5 * 60 * 1000) as unknown as number;

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingHorizontal: width * 0.05 }]}>
        {/* App logo and slogan */}
        <View style={[styles.header, { marginBottom: height * 0.12 }]}>
          <MovaLogo />
          <Text style={[styles.slogan, { 
            fontSize: Math.min(width * 0.055, 24),
            lineHeight: Math.min(width * 0.075, 32)
          }]}>
            Votre prochain emploi commence par une rencontre !
          </Text>
        </View>

        {/* Registration and login buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('ChooseRegisterType')}
          >
            <Text style={[styles.primaryButtonText, { fontSize: Math.min(width * 0.045, 18) }]}>
              Créer mon compte
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={[styles.secondaryButtonText, { fontSize: Math.min(width * 0.045, 18) }]}>
              {loading ? 'Chargement...' : 'Connexion'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// Styles for the HomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  statusContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.light.text,
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
