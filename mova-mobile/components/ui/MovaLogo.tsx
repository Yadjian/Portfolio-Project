import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * MovaLogo
 *
 * A reusable logo component for the Mova app.
 *
 * Main features:
 * - Renders a circular gradient background with the "Mova" text.
 * - Uses the Poppins_700Bold font for the logo text.
 * - Dynamically sizes the logo based on screen dimensions or a provided sizeProp.
 *
 * Props:
 * - sizeProp?: number — optional size for the logo (defaults to 30% of width or 18% of height).
 *
 * Key logic:
 * - Uses expo-linear-gradient for the background.
 * - Responsive sizing for different screens.
 */

export default function MovaLogo({ sizeProp }: { sizeProp?: number }) {
  const { width, height } = useWindowDimensions();
  const size = sizeProp || Math.min(width * 0.30, height * 0.18);

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
