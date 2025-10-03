import React from 'react';
import { TextInput, StyleSheet, useWindowDimensions, TextInputProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GenericInputBarProps extends TextInputProps {
  style?: object;
}

export default function GenericInputBar({ style, ...props }: GenericInputBarProps) {
  const { width, height } = useWindowDimensions();
  const inputWidth = width * 0.7;
  const inputHeight = height * 0.055;
  const borderRadius = inputHeight * 0.2;
  const paddingHorizontal = width * 0.03;
  const marginVertical = height * 0.015;
  const borderWidth = 2;

  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        width: inputWidth,
        borderRadius: borderRadius,
        marginVertical: marginVertical,
        padding: borderWidth,
      }}
    >
      <View style={{
        backgroundColor: '#fff',
        borderRadius: borderRadius,
        width: inputWidth - borderWidth * 2,
        height: inputHeight,
        justifyContent: 'center',
      }}>
        <TextInput
          style={[
            styles.input,
            {
              width: inputWidth - borderWidth * 2,
              height: inputHeight,
              borderRadius: borderRadius,
              paddingHorizontal: paddingHorizontal,
            },
            style,
          ]}
          {...props}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  input: {
<<<<<<< HEAD
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
=======
    backgroundColor: '#fff',
>>>>>>> origin/feature/frontend-LoginScreen
  },
});