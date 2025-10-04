import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import GradientBackground from '@/components/ui/ColorBackground';
import CustomTextInput from '@/components/ui/TextInput';
import CustomCard from '@/components/ui/WhiteFrame';
import MovaLogo from '@/components/ui/MovaLogo';
import GenericButton from '@/components/ui/GenericButton';

export default function RegisterCandidateScreen({ navigation }: any) {
  const { height, width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <GradientBackground>
      <View
        style={[
          styles.container,
          {
            padding: width * 0.05,
            paddingTop: height * 0.04,
          },
        ]}
      >
        <View style={{ marginBottom: height * 0.02 }}>
          <MovaLogo />
        </View>
        <CustomCard>
          <Text
            style={{
              fontSize: width * 0.07,
              fontWeight: 'bold',
              color: '#6746a8',
              textAlign: 'center',
              marginBottom: height * 0.04,
            }}
          >
            Inscription Candidat
          </Text>
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
          {/* Ajoute ici d'autres champs spécifiques au candidat */}
          <GenericButton
            title="Créer mon compte"
            onPress={() => {/* action d'inscription */}}
            style={{
              width: width * 0.4,
              height: height * 0.06,
              marginTop: height * 0.04,
              alignSelf: 'center',
            }}
            textStyle={{
              fontSize: width * 0.045,
            }}
          />
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