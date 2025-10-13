import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import { AuthStackParamList } from '../../lib/types';
import BackButton from '@/components/ui/BackButton';
import ChooseRegisterTypeScreen from '../screens/ChooseRegisterTypeScreen';
import CandidateProfileScreen from '../screens/ProfileScreens/CandidateProfileScreen';
import RecruiterProfileScreen from '../screens/ProfileScreens/RecruiterProfileScreen';
import SwipeNotificationScreen from '../screens/SwipeNotificationScreen';
import EditProfileScreen from '../screens/ProfileScreens/EditProfileScreen';
import RecruiterOnboardingScreen from '../screens/ProfileScreens/RecruiterOnboardingScreen';
import CreateCompanyScreen from '../screens/ProfileScreens/CreateCompanyScreen';
import JoinCompanyScreen from '../screens/ProfileScreens/JoinCompanyScreen';
import HomeButton from '@/components/ui/HomeButton';
import CandidateCVScreen from '../screens/CandidateCVScreen';
import RecruiterJobOfferScreen from '../screens/RecruiterJobOfferScreen';
import HomeScreen from '../screens/HomeScreen';

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
    setNotificationCount(0);
    console.log('Notifications consultées');
  };

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false,
        headerTitle: '', // force le header à être vide partout
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={({ navigation }: { navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'> }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="ChooseRegisterType"
        component={ChooseRegisterTypeScreen}
        options={({ navigation }: { navigation: NativeStackNavigationProp<AuthStackParamList, 'ChooseRegisterType'> }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CandidateProfile"
        component={CandidateProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="RecruiterProfile"
        component={RecruiterProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="SwipeNotification"
        component={SwipeNotificationScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="RecruiterOnboarding"
        component={RecruiterOnboardingScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CreateCompany"
        component={CreateCompanyScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="JoinCompany"
        component={JoinCompanyScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="CandidateCVScreen"
        component={CandidateCVScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="RecruiterJobOfferScreen"
        component={RecruiterJobOfferScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => (
            <HomeButton onPress={() => navigation.navigate('Home')} />
          ),
          headerBackTitleVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}