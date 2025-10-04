import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomTextInput(props: TextInputProps) {
  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    >
      <TextInput
        {...props}
        style={styles.input}
        placeholderTextColor="#6746a8"
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 10,
    padding: 2,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});