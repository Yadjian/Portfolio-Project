import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, TextInput, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GradientBackground from '@/components/ui/ColorBackground';
import CustomCard from '../../components/ui/WhiteFrame';
import MovaLogo from '../../components/ui/MovaLogo';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { height, width } = useWindowDimensions();

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
              marginTop: height * 0.05,
              fontSize: width * 0.07,
              fontWeight: 'bold',
              color: '#6746a8',
              textAlign: 'center',
              marginBottom: height * 0.08,
            }}
          >
            Connexion
          </Text>

          <LinearGradient
            colors={['#6746a8', '#6b25f9', '#07b9ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 10,
              padding: 2,
              width: '90%',
              alignSelf: 'center',
              marginBottom: height * 0.050,
            }}
          >
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#6746a8"
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingHorizontal: 16,
                fontSize: 16,
                width: '100%',
                height: height * 0.07,
              }}
            />
          </LinearGradient>

          <LinearGradient
            colors={['#6746a8', '#6b25f9', '#07b9ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 10,
              padding: 2,
              width: '90%',
              alignSelf: 'center',
              marginBottom: height * 0.01,
            }}
          >
            <TextInput
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#6746a8"
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                paddingHorizontal: 16,
                fontSize: 16,
                width: '100%',
                height: height * 0.07,
              }}
            />
          </LinearGradient>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: height * 0.01,
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <Pressable onPress={() => navigation.navigate('ChooseRegisterType')}>
              <Text style={{ color: '#6746a8', fontSize: width * 0.033 }}>
                Créer mon compte
              </Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
              <Text
                style={{
                  color: '#6746a8',
                  fontSize: width * 0.033,
                }}
              >
                Mot de passe oublié ?
              </Text>
            </Pressable>
          </View>

          <LinearGradient
            colors={['#6746a8', '#6b25f9', '#07b9ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 25,
              width: '55%',
              alignSelf: 'center',
              marginTop: height * 0.09,
              paddingVertical: height * 0.015,
              paddingHorizontal: width * 0.08
            }}
          >
            <Pressable
              onPress={() => console.log('Login pressed')}
              style={{
                borderRadius: 10,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: width * 0.045,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                Se connecter
              </Text>
            </Pressable>
          </LinearGradient>
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