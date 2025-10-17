import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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