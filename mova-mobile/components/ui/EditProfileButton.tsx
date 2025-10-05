import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EditProfileButtonProps {
  onPress: () => void;
  style?: ViewStyle;
  size?: number;
}

export default function EditProfileButton({ 
  onPress, 
  style, 
  size = 24
}: EditProfileButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="pencil" size={size} color="#6746a8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});