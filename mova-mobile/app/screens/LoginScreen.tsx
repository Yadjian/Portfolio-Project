import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { LoginScreenProps } from '../types'; // Importer les types

export default function LoginScreen({ navigation }: LoginScreenProps) {
  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});