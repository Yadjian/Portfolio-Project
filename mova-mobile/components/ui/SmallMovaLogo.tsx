import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SmallMovaLogo() {
  const { width } = useWindowDimensions();
  const size = width * 0.2;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6746a8', '#6b25f9', '#07b9ff']}
        style={[
          styles.titleContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[styles.title, { fontSize: size * 0.30, fontFamily: 'Dynapuff' }]}>
          Mova
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center', // Centre le LinearGradient horizontalement
    padding: 8,
  },
  titleContainer: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  title: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});