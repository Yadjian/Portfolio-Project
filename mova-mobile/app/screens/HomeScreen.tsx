import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Location from 'expo-location';

import MovaLogo from '@/components/ui/MovaLogo';
import { useAuth } from '../../contexts/AuthContext';
import { sendLocationToBackend, checkBackendHealth } from '../../services/api';
import Colors from '../../constants/Colors';
import { AuthStackParamList, getApiUrl } from '@/lib/types';

const { height, width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { loading } = useAuth();
  const [backendStatus, setBackendStatus] = useState('Vérification de la connexion...');

  // Test de connexion au backend
  useEffect(() => {
    const testBackendConnection = async () => {
      const API_URL = getApiUrl();
      console.log('🔍 [BACKEND TEST] URL détectée:', API_URL);
      
      try {
        const data = await checkBackendHealth();
        console.log('✅ [BACKEND TEST] Réponse reçue:', data);
        setBackendStatus(`✅ Backend connecté (${API_URL})`);
      } catch (error) {
        console.error('❌ [BACKEND TEST] Message:', error instanceof Error ? error.message : 'Erreur inconnue');
        setBackendStatus(`❌ Backend non accessible (${API_URL})`);
      }
    };

    console.log('[BACKEND TEST] useEffect déclenché');
    testBackendConnection();
  }, []);

  // Géolocalisation : demande la permission et envoie périodiquement
  useEffect(() => {
    let interval: number;

    const askAndSendLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission refusée');
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({});
        await sendLocationToBackend({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Could not get location", error)
      }
    };

    askAndSendLocation();
    interval = setInterval(askAndSendLocation, 5 * 60 * 1000) as unknown as number;

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Affichage du statut backend */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{backendStatus}</Text>
        </View>

        <View style={styles.header}>
          <MovaLogo />
          <Text style={styles.slogan}>
            Votre prochain emploi commence par une rencontre !
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('ChooseRegisterType')}
          >
            <Text style={styles.primaryButtonText}>Créer mon compte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>
              {loading ? 'Chargement...' : 'Connexion'}
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
    paddingHorizontal: width * 0.05,
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
    marginBottom: height * 0.12,
  },
  slogan: {
    fontSize: width * 0.06,
    color: Colors.light.text,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: width * 0.08,
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
    fontSize: width * 0.045,
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
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
});
