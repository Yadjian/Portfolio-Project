import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 6 : 0, // décale vers le haut sur iOS
  },
});