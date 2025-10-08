import React from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MovaLogo from '@/components/ui/MovaLogo';
import { useAuth } from '../../contexts/AuthContext'; // Utilise le AuthProvider

const { height, width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  // Utilise les fonctions du AuthProvider
  const { isAuthenticated, user, login, logout, loading } = useAuth();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout(); // Fonction logout du AuthProvider
    } else {
      login(); // Fonction login du AuthProvider  
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MovaLogo />
        <Text style={styles.slogan}>
          Votre prochain emploi{'\n'}commence par une rencontre !
        </Text>
        {isAuthenticated && user && (
          <Text style={styles.welcomeText}>
            Bonjour {user.name || user.email} !
          </Text>
        )}
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
            onPress={handleAuthAction}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Chargement...' : isAuthenticated ? 'Déconnexion' : 'Connexion'}
            </Text>
          </Pressable>
        </LinearGradient>

        {!isAuthenticated && (
          <>
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
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.08,
  },
  slogan: {
    fontSize: width * 0.055,
    color: '#6746a8',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: width * 0.04,
    color: '#6746a8',
    textAlign: 'center',
    marginTop: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: width * 0.12,
    marginVertical: height * 0.04,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: height * 0.04,
  },
  gradientButton: {
    borderRadius: 30,
    width: width * 0.7,
    height: 54,
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
    fontSize: width * 0.045,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});