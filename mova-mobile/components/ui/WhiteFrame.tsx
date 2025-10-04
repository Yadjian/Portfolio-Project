import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface CustomCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function CustomCard({ children, style }: CustomCardProps) {
  return (
    <View style={[styles.card, style]}>
    <View
      style={[
        styles.card,
        {
          borderRadius: 25,
          paddingVertical: height * 0.08,
          paddingHorizontal: width * 0.09,
          minHeight: height * 0.5,
          marginBottom: height * 0.05,
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 32,
    width: '95%',
    minHeight: '70%',
  },
});