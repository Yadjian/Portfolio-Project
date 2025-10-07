import React from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import MovaLogo from '@/components/ui/MovaLogo';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '../../constants/auth0Config';

WebBrowser.maybeCompleteAuthSession();

const { height, width } = Dimensions.get('window');

// Configuration Auth0
const discovery = {
  authorizationEndpoint: `https://${AUTH0_DOMAIN}/authorize`,
  tokenEndpoint: `https://${AUTH0_DOMAIN}/oauth/token`,
  revocationEndpoint: `https://${AUTH0_DOMAIN}/oauth/revoke`,
};

export default function WelcomeScreen({ navigation }: any) {
  const redirectUri = AuthSession.makeRedirectUri({
    preferLocalhost: true,
  });

  const [request, result, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: AUTH0_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      extraParams: {
        audience: `https://${AUTH0_DOMAIN}/userinfo`,
      },
      responseType: AuthSession.ResponseType.Token,
      redirectUri,
    },
    discovery
  );

  React.useEffect(() => {
    if (result) {
      if (result.type === 'success') {
        console.log('Connexion réussie:', result.params);
        // Ici tu peux stocker le token et naviguer vers l'écran principal
      } else if (result.type === 'error') {
        console.error('Erreur de connexion:', result.error);
      }
    }
  }, [result]);

  const handleLogin = async () => {
    promptAsync();
  };

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
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Connexion</Text>
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