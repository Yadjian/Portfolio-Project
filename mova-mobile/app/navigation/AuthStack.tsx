import React from 'react';
import { Button } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }: { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> }) => ({
          headerLeft: () => (
            <Button title="Retour" onPress={() => navigation.navigate('Welcome')} />
          ),
        })}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={({ navigation }: { navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'> }) => ({
          headerLeft: () => (
            <Button title="Retour" onPress={() => navigation.navigate('Welcome')} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}