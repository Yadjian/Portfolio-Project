import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * GradientBackground (ColorBackground.tsx)
 *
 * A reusable component that renders a horizontal linear gradient background.
 *
 * Main features:
 * - Wraps its children in a gradient background.
 * - Accepts custom styles for the container.
 * - Uses a predefined color gradient (purple to blue).
 *
 * Props:
 * - children: React.ReactNode — content to display inside the gradient.
 * - style?: ViewStyle — optional custom style for the container.
 *
 * Key logic:
 * - Uses expo-linear-gradient for performant gradients.
 * - Combines default and custom styles.
 */

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function GradientBackground({ children, style }: GradientBackgroundProps) {
  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.gradientBackground, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
});
