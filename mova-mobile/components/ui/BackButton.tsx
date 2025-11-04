import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * BackButton
 *
 * A reusable back button component for navigation headers.
 *
 * Main features:
 * - Renders a left arrow icon (Ionicons).
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

interface BackButtonProps {
  onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      android_ripple={{ color: '#eee', borderless: true }}
    >
      <Ionicons name="arrow-back-outline" size={28} color="#4930a3" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
  },
});
