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
  
  // Taille dynamique simple : plus l'écran est large, plus l'icône est grande
  const dynamicSize = size || Math.floor(width * 0.08);
  
  const dynamicStyles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: width * 0.03,
    },
  });

  return (
    <TouchableOpacity 
      style={[dynamicStyles.container, style]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="pencil" size={dynamicSize} color="#ffffffff" />
    </TouchableOpacity>
  );
}