import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Platform } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
  const buttonSize = 35;

  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      android_ripple={{ color: '#eee', borderless: true }}
    >
      <Svg width={buttonSize} height={buttonSize} viewBox="0 0 32 32" fill="none">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#6746a8" />
            <Stop offset="50%" stopColor="#6b25f9" />
            <Stop offset="100%" stopColor="#07b9ff" />
          </LinearGradient>
        </Defs>
        <Path
          d="M26 16H10 M16 22L10 16L16 10"
          stroke="url(#grad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
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