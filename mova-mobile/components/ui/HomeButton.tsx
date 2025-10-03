import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface HomeButtonProps {
  onPress: () => void;
}

export default function HomeButton({ onPress }: HomeButtonProps) {
  const { width, height } = useWindowDimensions();
  const buttonSize = Math.min(width, height) * 0.09;
  const padding = buttonSize * 0.3;
  const marginLeft = -buttonSize * 0.25;

  return (
    <Pressable style={[styles.button, { padding, marginLeft }]} onPress={onPress}>
      <Svg width={buttonSize} height={buttonSize} viewBox="0 0 32 32" fill="none">
        <Defs>
          <LinearGradient id="homeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#6746a8" />
            <Stop offset="50%" stopColor="#6b25f9" />
            <Stop offset="100%" stopColor="#07b9ff" />
          </LinearGradient>
        </Defs>
        {/* Maison stylisée */}
        <Path
          d="M6 14L16 6L26 14"
          stroke="url(#homeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8 14V24H24V14"
          stroke="url(#homeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M14 24V18H18V24"
          stroke="url(#homeGrad)"
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
    // Les valeurs sont dynamiques via le composant
  },
});