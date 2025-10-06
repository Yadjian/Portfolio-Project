import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { AuthStackParamList } from '../types';
import BackButton from '@/components/ui/BackButton';
import ChooseRegisterTypeScreen from '../screens/ChooseRegisterTypeScreen';
import CandidateProfileScreen from '../screens/ProfileScreens/CandidateProfileScreen';
import RecruiterProfileScreen from '../screens/ProfileScreens/RecruiterProfileScreen';
import NotificationButton from '@/components/ui/NotificationButton';
import SwipeNotificationScreen from '../screens/SwipeNotificationScreen';



const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    // Simule la récupération du nombre de notifications depuis une API
    const fetchNotificationCount = () => {
      const fetchedCount = 7; // Simulation de 7 notifications
      setNotificationCount(fetchedCount);
    };
    fetchNotificationCount();
  }, []);

  const handleNotificationPress = () => {
    // Pour l'instant, on remet juste le compteur à zéro
    setNotificationCount(0);
    console.log('Notifications consultées');
  };

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false,
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
        })}
      />
      <Stack.Screen
        name="CandidateProfile"
        component={CandidateProfileScreen}
        options={({ navigation }: { navigation: NativeStackNavigationProp<AuthStackParamList, 'CandidateProfile'> }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerTitle: () => null,
          headerRight: () => (
            <NotificationButton 
              notificationCount={notificationCount} 
              onPress={() => {
                setNotificationCount(0);
                navigation.navigate('SwipeNotification', { userType: 'candidat' });
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="RecruiterProfile"
        component={RecruiterProfileScreen}
        options={({ navigation }: { navigation: NativeStackNavigationProp<AuthStackParamList, 'RecruiterProfile'> }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerTitle: () => null,
          headerRight: () => (
            <NotificationButton 
              notificationCount={notificationCount} 
              onPress={() => {
                setNotificationCount(0);
                navigation.navigate('SwipeNotification', { userType: 'recruteur' });
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="SwipeNotification"
        component={SwipeNotificationScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerTitle: () => null,
        })}
      />
    </Stack.Navigator>
  );
}