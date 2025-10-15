import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MovaLogo from '@/components/ui/MovaLogo';
import { useAuth } from '../../contexts/AuthContext';
import * as Location from 'expo-location';
import { sendLocationToBackend } from '../../services/api';

const { height, width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  // Géolocalisation : demande la permission et envoie périodiquement
  useEffect(() => {
    let interval: number;

    const askAndSendLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission refusée');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      await sendLocationToBackend({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    askAndSendLocation();
    interval = setInterval(askAndSendLocation, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // AuthProvider
  const { loading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MovaLogo />
        <Text style={styles.slogan}>
          Votre prochain emploi{'\n'}commence par une rencontre !
        </Text>
      </View>
      <View style={styles.separator} />
      <View style={styles.buttonContainer}>
        <LinearGradient
          colors={['#6746a8', '#6b25f9', '#07b9ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Pressable
            style={styles.pressable}
            onPress={() => navigation.navigate('Login')}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Chargement...' : 'Connexion'}
            </Text>
          </Pressable>
        </LinearGradient>
        <View style={{ marginVertical: 20 }} />
        <LinearGradient
          colors={['#6746a8', '#6b25f9', '#07b9ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Pressable
            style={styles.pressable}
            onPress={() => navigation.navigate('ChooseRegisterType')}
          >
            <Text style={styles.buttonText}>Créer mon compte</Text>
          </Pressable>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.2,
  },
  slogan: {
    fontSize: width * 0.055,
    color: '#6746a8',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: width * 0.12,
    marginVertical: height * 0.03,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  gradientButton: {
    borderRadius: 25,
    width: width * 0.8,
    height: height * 0.09,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center',
  },
});