import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';

export default function MovaLogo({ sizeProp }: { sizeProp?: number }) {
  const { width } = useWindowDimensions();
  const size = sizeProp || width * 0.40;

  return (
    <LinearGradient
      colors={['#5546CC', '#4930a3']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.logoContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.title, { fontSize: size * 0.32, fontFamily: 'Poppins_700Bold' }]}>Mova</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4930a3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 12,
  },
  title: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});