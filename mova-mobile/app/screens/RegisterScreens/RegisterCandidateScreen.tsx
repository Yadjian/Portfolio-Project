import React from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import SmallMovaLogo from '@/components/ui/SmallMovaLogo';
import CustomCard from '@/components/ui/WhiteFrame';
import GradientBackground from '@/components/ui/ColorBackground';

export default function RegisterCandidateScreen({ navigation }: any) {
  const { height, width } = useWindowDimensions();

  return (
    <GradientBackground>
      <View style={[styles.container, { backgroundColor: 'transparent' }]}>
        {/* Logo centré */}
        <View style={{ alignItems: 'center' }}>
          <SmallMovaLogo />
        </View>
        <CustomCard>
          <View style={{ alignItems: 'center' }}>
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
          {/* Bouton Auth0 pour créer un compte */}
          <Pressable
            style={{
              backgroundColor: '#07b9ff',
              elevation: 2,
              marginTop: height * 0.04,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              borderRadius: height * 0.05,
              width: '90%',
              paddingVertical: height * 0.025,
            }}
            onPress={() => {
              // Ici tu appelles Auth0 pour l'inscription
              // Exemple :
              // auth0.webAuth.authorize({ scope: 'openid profile email', prompt: 'login' })
            }}
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