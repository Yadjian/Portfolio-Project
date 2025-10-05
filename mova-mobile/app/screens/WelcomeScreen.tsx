import React from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MovaLogo from '@/components/ui/MovaLogo';

const { height, width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
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
            onPress={() => navigation.navigate('Profile')}
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
    backgroundColor: '#FFFFFF',
    paddingTop: height * 0.08,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  slogan: {
    marginTop: height * 0.05,
    fontSize: width * 0.055,
    color: '#6746a8',
    textAlign: 'center',
    fontWeight: 'bold',
    paddingHorizontal: width * 0.06,
  },
  separator: {
    width: '80%',
    height: 1,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginVertical: 18,
    borderRadius: 1,
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: height * 0.06,
    paddingHorizontal: width * 0.05,
  },
  gradientButton: {
    width: '95%',
    borderRadius: 25,
    alignSelf: 'center',
    paddingVertical: height * 0.03,
  },
  pressable: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});