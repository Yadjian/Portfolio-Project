import React from 'react';
import { TextInput, StyleSheet, useWindowDimensions, TextInputProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GenericInputBarProps extends TextInputProps {
  style?: object;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
}

export default function GenericInputBar({ style, rightIcon, multiline, ...props }: GenericInputBarProps) {
  const { width, height } = useWindowDimensions();
  const inputWidth = width * 0.8; // marge latérale automatique
  const inputHeight = multiline ? height * 0.13 : height * 0.06;
  const borderRadius = inputHeight * 0.22;
  const paddingHorizontal = width * 0.04;
  const marginVertical = height * 0.012;
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
        alignSelf: 'center', // <-- centre le champ, marge à gauche et à droite
      }}
    >
      <View style={{
        backgroundColor: '#fff',
        borderRadius: borderRadius,
        width: inputWidth - borderWidth * 2,
        minHeight: inputHeight,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 8,
      }}>
        <TextInput
          style={[
            styles.input,
            {
              flex: 1,
              minHeight: inputHeight,
              borderRadius: borderRadius,
              paddingHorizontal: paddingHorizontal,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            style,
          ]}
          multiline={multiline}
          {...props}
        />
        {rightIcon ? (
          <View style={{ marginLeft: 8 }}>
            {rightIcon}
          </View>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#222',
  },
});