import React from 'react';
import { View, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';

interface WhiteCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function WhiteCard({ children, style }: WhiteCardProps) {
  const { width, height } = useWindowDimensions();

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: width * 0.07,
          width: width * 0.9,
          height: height * 0.85,
          paddingBottom: height * 0.04,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});