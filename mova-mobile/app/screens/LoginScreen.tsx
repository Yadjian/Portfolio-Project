import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import du LinearGradient
import CustomButton from '../../components/ui/DefautColorButton';
import CustomTextInput from '../../components/ui/CustomTextInput';
import CustomCard from '../../components/ui/WhiteBackGround';
import MovaLogo from '../../components/ui/MovaLogo'; // Import du composant MovaLogo
import CustomBackButton from '../../components/ui/BackButton'; // Import du bouton retour

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']} // Dégradé violet-bleu
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }} // Début du dégradé (gauche)
      end={{ x: 1, y: 0 }} // Fin du dégradé (droite)
    >
      <View style={styles.container}>
        {/* Titre avec dégradé */}
        <MovaLogo />

        {/* Formulaire de connexion */}
        <CustomCard>
          <CustomTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <CustomTextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Pressable onPress={() => navigation.navigate('Register')}>
            <Text style={styles.createAccountText}>Créer mon compte</Text>
          </Pressable>

          <CustomButton
            title="Se connecter"
            onPress={() => console.log('Login pressed')}
            style={{
              backgroundColor: '#6b25f9', // Couleur personnalisée (optionnel)
              width: 150, // Réduit la largeur du bouton
              height: 40, // Réduit la hauteur du bouton
              marginTop: 20, // Ajoute un espacement au-dessus
              alignSelf: 'center',
            }}
            textStyle={{
              fontSize: 14, // Réduit la taille du texte
            }}
          />
        </CustomCard>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1, // Prend tout l'espace disponible
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButtonContainer: {
    position: 'absolute',
    top: 40, // Position en haut de l'écran
    left: 20, // Position à droite de l'écran
    zIndex: 1, // Assure que le bouton est au-dessus des autres éléments
  },
  createAccountText: {
  color: '#000000ff', // Couleur du texte (vert clair)
  fontSize: 12, // Taille du texte
  textAlign: 'right', // Centre le texte horizontalement
  marginTop: 8, // Espacement au-dessus
},
});