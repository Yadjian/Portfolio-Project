import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { AuthStackParamList } from '../types';
import BackButton from '@/components/ui/BackButton';
import ChooseRegisterTypeScreen from '../screens/RegisterScreens/ChooseRegisterTypeScreen';
import HomeButton from '@/components/ui/HomeButton';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
      }}
    >
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
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerTitle: () => null,
        })}
      />
      <Stack.Screen
        name="ChooseRegisterType"
        component={ChooseRegisterTypeScreen}
        options={({ navigation }: { navigation: NativeStackNavigationProp<AuthStackParamList, 'ChooseRegisterType'> }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerTitle: () => null,
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Welcome')} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}