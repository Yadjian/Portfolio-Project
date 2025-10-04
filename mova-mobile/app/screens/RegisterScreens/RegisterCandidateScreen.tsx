import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import CustomTextInput from '@/components/ui/TextInput';
import SmallMovaLogo from '@/components/ui/SmallMovaLogo';
import CustomCard from '@/components/ui/WhiteFrame';
import GradientBackground from '@/components/ui/ColorBackground';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterCandidateScreen({ navigation }: any) {
  const { height, width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const buttonWidth = width * 0.85;
  const buttonRadius = height * 0.05;
  const buttonPaddingVertical = height * 0.025;

  return (
    <GradientBackground>
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        <CustomCard style={{ width: '90%', alignItems: 'center', paddingVertical: height * 0.04 }}>
          <View style={{ alignItems: 'flex-start', width: '100%' }}>
            <SmallMovaLogo/>
          </View>
          <View style={{ alignItems: 'center', marginBottom: height * 0.08 }}>
            <Text
              style={{
                fontSize: width * 0.07,
                fontWeight: 'bold',
                color: '#6746a8',
                textAlign: 'center',
                borderRadius: 25,
                paddingVertical: height * 0.04,
                paddingHorizontal: width * 0.09,
                marginVertical: height * 0.02,
              }}
            >
              Inscription Candidat
            </Text>
          </View>
          <CustomTextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <CustomTextInput
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#6746a8" />
              </Pressable>
            }
          />
          <CustomTextInput
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <CustomTextInput
            placeholder="Nom"
            value={nom}
            onChangeText={setNom}
          />
          <CustomTextInput
            placeholder="Prénom"
            value={prenom}
            onChangeText={setPrenom}
          />
          <Pressable
            style={{
              backgroundColor: '#07b9ff',
              borderRadius: buttonRadius,
              width: buttonWidth,
              paddingVertical: buttonPaddingVertical,
              elevation: 2,
              marginTop: height * 0.04,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            onPress={() => {/* action d'inscription */}}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: width * 0.05,
                fontWeight: 'bold',
              }}
            >
              Créer mon compte
            </Text>
          </Pressable>
        </CustomCard>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});