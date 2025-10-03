import React from 'react';
import { Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MovaLogo() {
  const { height } = useWindowDimensions();
  const size = Math.min(height * 0.18, 180); // max 120px

  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']}
      style={[
        styles.titleContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[styles.title, { fontSize: size * 0.32, fontFamily: 'Dynapuff' }]}>Mova</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});