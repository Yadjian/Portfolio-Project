import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';

const { height, width } = Dimensions.get('window');

export default function ChooseRegisterTypeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.content}>
          <MovaLogo sizeProp={60} />
          <Text style={styles.title}>Vous êtes ?</Text>
          <Pressable
            style={[styles.button, { backgroundColor: '#07b9ff' }]}
            onPress={() => navigation.navigate('CreateAccount', { userType: 'candidate' })}
          >
            <Text style={styles.buttonText}>Candidat</Text>
          </Pressable>
          <View style={{ marginVertical: height * 0.03 }} />
          <Pressable
            style={[styles.button, { backgroundColor: '#6b25f9' }]}
            onPress={() => navigation.navigate('CreateAccount', { userType: 'recruiter' })}
          >
            <Text style={styles.buttonText}>Recruteur</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // même fond que CreateCompanyScreen
    justifyContent: 'flex-start',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: width * 0.045,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.06,
    marginVertical: height * 0.02,
    marginHorizontal: width * 0.03,
    shadowColor: '#6746a8',
    shadowOpacity: 0.08,
    shadowRadius: width * 0.03,
    elevation: 4,
    justifyContent: 'flex-start', // <-- le logo remonte dans la card
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6746a8',
    marginBottom: 60,
    marginTop: 70, // <-- espace augmenté sous le logo
    textAlign: 'center',
  },
  button: {
    width: width * 0.8,
    height: height * 0.09,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.03,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.055,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});