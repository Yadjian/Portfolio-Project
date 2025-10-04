import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
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
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={['#6746a8', '#6b25f9', '#07b9ff']}
        style={[
          styles.button,
          style,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={textStyle}>
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
    borderRadius: 24,
    alignSelf: 'center',
  },
});