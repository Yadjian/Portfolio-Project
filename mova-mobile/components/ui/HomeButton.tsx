import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

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
    marginTop: Platform.OS === 'ios' ? 6 : 0, // décale vers le haut sur iOS
  },
});