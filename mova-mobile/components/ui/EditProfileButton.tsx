import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * EditProfileButton
 *
 * A reusable button component for editing a profile.
 *
 * Main features:
 * - Renders a pencil icon (Ionicons) as a button.
 * - Calls the onPress callback when pressed.
 * - Supports custom style and dynamic sizing based on screen width.
 *
 * Props:
 * - onPress: () => void — function to call when the button is pressed.
 * - style?: ViewStyle — optional custom style for the button.
 * - size?: number — optional icon size (defaults to 8% of screen width).
 *
 * Key logic:
 * - Uses useWindowDimensions to compute a responsive default size.
 * - Uses activeOpacity for touch feedback.
 */

interface EditProfileButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
}

export default function EditProfileButton({ 
  onPress, 
  style, 
  size 
}: EditProfileButtonProps) {
  const { width } = useWindowDimensions();
  const dynamicSize = size || Math.floor(width * 0.08);

  return (
    <TouchableOpacity 
      style={style} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="pencil" size={dynamicSize} color="#6b25f9" />
    </TouchableOpacity>
  );
}