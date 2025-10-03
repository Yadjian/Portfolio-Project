import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GenericButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function GenericButton({
  title,
  onPress,
  style,
  textStyle,
}: GenericButtonProps) {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#6746a8', '#6b25f9', '#07b9ff']} // Design fixe
        style={[styles.button, style]} // Taille/forme personnalisable
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25, // Forme de base
    paddingVertical: 15, // Padding de base
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});