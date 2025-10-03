import React from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';

interface WhiteframeProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Whiteframe({ children, style }: WhiteframeProps) {
  const { height, width } = useWindowDimensions();

  return (
    <View
      style={[
        styles.frame,
        {
          minHeight: height * 0.5,
          marginBottom: height * 0.04,
          borderRadius: 25,
          paddingVertical: height * 0.08,
          paddingHorizontal: width * 0.09,
          marginVertical: height * 0.02,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 20,
  },
});