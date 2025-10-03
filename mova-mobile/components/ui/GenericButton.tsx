import React from 'react';
import { Pressable, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GenericButton({
  title,
  onPress,
  style,
  textStyle,
}: {
  title: string;
  onPress: () => void;
  style?: object;
  textStyle?: object;
}) {
  const { width, height } = useWindowDimensions();

  // Limite la largeur et la hauteur max
  const buttonWidth = Math.min(width * 0.8, 400);
  const buttonHeight = Math.min(height * 0.07, 70);

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#6746a8', '#6b25f9', '#07b9ff']}
        style={[
          styles.button,
          {
            width: buttonWidth,
            height: buttonHeight,
            borderRadius: buttonWidth * 0.08,
          },
          style,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[
          styles.buttonText,
          { fontSize: Math.min(width * 0.055, 22) },
          textStyle,
        ]}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});