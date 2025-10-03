import React from 'react';
import { View, Text, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import GradientBackground from '@/components/ui/ColorBackground';

export default function ChooseRegisterTypeScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();

  return (
    <GradientBackground>
      <View style={[styles.container, { padding: width * 0.05, paddingTop: height * 0.04 }]}>
        <Text style={styles.title}>Je suis...</Text>
        <Pressable
          style={[styles.button, { marginBottom: height * 0.03 }]}
          onPress={() => navigation.navigate('RegisterCandidate')}
        >
          <Text style={styles.buttonText}>Candidat</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('RegisterRecruiter')}
        >
          <Text style={styles.buttonText}>Recruteur</Text>
        </Pressable>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6746a8',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 40,
    elevation: 2,
    marginVertical: 8,
  },
  buttonText: {
    color: '#6746a8',
    fontSize: 20,
    fontWeight: 'bold',
  },
});