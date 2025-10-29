import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

/**
 * HomeButton
 *
 * A reusable home button component for navigation headers.
 *
 * Main features:
 * - Renders a home icon (FontAwesome).
 * - Calls the onPress callback when pressed.
 * - Uses android ripple effect and iOS margin adjustment.
 *
 * Props:
 * - onPress: () => void — function to call when the button is pressed.
 *
 * Key logic:
 * - Platform-specific margin for iOS.
 * - Transparent background for seamless header integration.
 */

interface HomeButtonProps {
  onPress: () => void;
}

export default function HomeButton({ onPress }: HomeButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      android_ripple={{ color: '#eee', borderless: true }}
    >
      <FontAwesome name="home" size={28} color="#4930a3" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 6 : 0,
  },
});
