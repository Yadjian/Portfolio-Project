import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Logo temporaire, comme sur les autres écrans
const Logo = () => (
  <View style={styles.logoContainer}>
    <Text style={styles.logoText}>Mova</Text>
  </View>
);

export default function RegisterScreen() {
  // 1. L'état qui va gérer quel type d'utilisateur est sélectionné
  const [userType, setUserType] = useState<'candidat' | 'recruteur'>('candidat');

  return (
    <LinearGradient colors={['#6a11cb', '#2575fc']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Logo />
          <Text style={styles.title}>Créer un compte</Text>

          {/* 2. Le sélecteur de type de profil */}
          <View style={styles.switcherContainer}>
            <TouchableOpacity
              style={[styles.switcherButton, userType === 'candidat' && styles.switcherButtonActive]}
              onPress={() => setUserType('candidat')}
            >
              <Text style={styles.switcherText}>Candidat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.switcherButton, userType === 'recruteur' && styles.switcherButtonActive]}
              onPress={() => setUserType('recruteur')}
            >
              <Text style={styles.switcherText}>Recruteur</Text>
            </TouchableOpacity>
          </View>

          {/* Champs communs */}
          <TextInput placeholder="Nom complet" placeholderTextColor="#eee" style={styles.input} />
          <TextInput placeholder="Adresse e-mail" placeholderTextColor="#eee" style={styles.input} keyboardType="email-address" />
          <TextInput placeholder="Mot de passe" placeholderTextColor="#eee" style={styles.input} secureTextEntry />

          {/* 3. Les champs qui s'affichent dynamiquement */}
          {userType === 'candidat' && (
            <>
              <TextInput placeholder="Titre du poste recherché (ex: Développeur)" placeholderTextColor="#eee" style={styles.input} />
              <TextInput placeholder="Ville" placeholderTextColor="#eee" style={styles.input} />
            </>
          )}

          {userType === 'recruteur' && (
            <>
              <TextInput placeholder="Numero de siret" placeholderTextColor="#eee" style={styles.input} />
              <TextInput placeholder="Nom de l'entreprise" placeholderTextColor="#eee" style={styles.input} />
              <TextInput placeholder="Votre poste dans l'entreprise" placeholderTextColor="#eee" style={styles.input} />
            </>
          )}
          
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Créer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  formContainer: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  switcherContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 25,
    marginBottom: 20,
  },
  switcherButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  switcherButtonActive: {
    backgroundColor: '#2575fc',
  },
  switcherText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#2575fc',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
