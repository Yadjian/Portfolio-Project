import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../lib/types';
import MovaLogo from '../../components/ui/MovaLogo';
import Colors from '../../constants/Colors';

export default function UserHomeScreen() {
  const { logout, user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleLoginWithAnotherAccount = () => {
    logout();
    // La redirection vers la page de connexion est gérée par le changement de contexte d'authentification
  };

  return (
    <View style={styles.container}>
      <MovaLogo />
      <Text style={styles.title}>Menu Principal</Text>
      <TouchableOpacity style={styles.button} onPress={handleLoginWithAnotherAccount}>
        <Text style={styles.buttonText}>Se connecter avec un autre compte</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
        <Text style={[styles.buttonText, styles.logoutButtonText]}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4930a3',
    marginVertical: 40,
  },
  button: {
    backgroundColor: '#4930a3',
    borderRadius: 30,
    width: '80%',
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#4930a3',
  },
  logoutButtonText: {
    color: '#4930a3',
  },
});