import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserHomeScreen from '../screens/UserHomeScreen';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="UserHome" component={UserHomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}