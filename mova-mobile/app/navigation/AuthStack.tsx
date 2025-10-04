import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { AuthStackParamList } from '../types';
import BackButton from '@/components/ui/BackButton';
import RegisterCandidateScreen from '../screens/RegisterScreens/RegisterCandidateScreen';
import RegisterRecruiterScreen from '../screens/RegisterScreens/RegisterRecruiterScreen';
import ChooseRegisterTypeScreen from '../screens/RegisterScreens/ChooseRegisterTypeScreen';

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
            <BackButton onPress={() => navigation.navigate('Welcome')} />
          ),
          headerTitle: () => null,
        })}
      />
      <Stack.Screen
        name="ChooseRegisterType"
        component={ChooseRegisterTypeScreen}
      />
      <Stack.Screen
        name="RegisterCandidate"
        component={RegisterCandidateScreen}
      />
      <Stack.Screen
        name="RegisterRecruiter"
        component={RegisterRecruiterScreen}
      />
    </Stack.Navigator>
  );
}