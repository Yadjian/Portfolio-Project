import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import { AuthStackParamList } from '../../lib/types';
import BackButton from '@/components/ui/BackButton';
import ChooseRegisterTypeScreen from '../screens/RegisterScreens/ChooseRegisterTypeScreen';
import CandidateProfileScreen from '../screens/ProfileScreens/CandidateProfileScreen';
import RecruiterProfileScreen from '../screens/ProfileScreens/RecruiterProfileScreen';
import SwipeNotificationScreen from '../screens/SwipeNotificationScreen';
import EditProfileScreen from '../screens/ProfileScreens/EditProfileScreen';
import HomeButton from '@/components/ui/HomeButton';
import CandidateCVScreen from '../screens/CandidateCVScreen';
import RecruiterJobOfferScreen from '../screens/RecruiterJobOfferScreen';
import HomeScreen from '../screens/HomeScreen';
import CreateAccountScreen from '../screens/RegisterScreens/CreateAccountScreen';
import CreateCompanyScreen from '../screens/RegisterScreens/CreateCompanyScreen';
import MovaLogo from '@/components/ui/MovaLogo';
import UserHomeScreen from '../screens/UserHomeScreen';
import HistoricalScreen from '../screens/HistoricalScreen';
import MatchDetailScreen from '../screens/MatchDetailScreen';

/**
 * AuthStack
 *
 * This component defines the authentication and onboarding navigation stack.
 *
 * Main features:
 * - Manages all screens related to authentication, registration, and onboarding.
 * - Uses React Navigation's native stack navigator.
 * - Customizes headers for each screen (logo, back button, home button, etc.).
 * - Handles navigation between login, registration, profile, and onboarding flows.
 *
 * Key logic:
 * - Each Stack.Screen represents a screen in the authentication/onboarding flow.
 * - Uses headerLeft/headerRight to customize navigation bar.
 * - Uses headerShown: false for screens that manage their own header.
 */

const Stack = createNativeStackNavigator<AuthStackParamList>();

// Main component that renders the authentication stack navigator
// Each Stack.Screen below represents a screen in the authentication/onboarding flow
export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerShadowVisible: false,
        headerTitle: '', // force header to be empty everywhere
      }}
    >
      {/* Home screen for unauthenticated users */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {/* Login screen */}
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
      {/* Screen to choose registration type (candidate or recruiter) */}
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
      {/* Candidate profile screen */}
      <Stack.Screen
        name="CandidateProfile"
        component={CandidateProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      {/* Recruiter profile screen */}
      <Stack.Screen
        name="RecruiterProfile"
        component={RecruiterProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      {/* Historical screen for user activity/history */}
      <Stack.Screen
        name="HistoricalScreen"
        component={HistoricalScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      {/* Swipe notification screen */}
      <Stack.Screen
        name="SwipeNotification"
        component={SwipeNotificationScreen}
        options={{ headerShown: false }}
      />
      {/* Edit profile screen */}
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerBackTitleVisible: false,
        })}
      />
      {/* Candidate CV screen */}
      <Stack.Screen
        name="CandidateCVScreen"
        component={CandidateCVScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      {/* Recruiter job offer screen */}
      <Stack.Screen
        name="RecruiterJobOfferScreen"
        component={RecruiterJobOfferScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      {/* Create account screen */}
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccountScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => <HomeButton onPress={() => navigation.navigate('Home')} />,
          headerBackTitleVisible: false,
        })}
      />
      {/* Create company screen */}
      <Stack.Screen
        name="CreateCompany"
        component={CreateCompanyScreen}
        options={({ navigation }) => ({
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
          headerRight: () => <HomeButton onPress={() => navigation.navigate('Home')} />,
          headerBackTitleVisible: false,
        })}
      />
      {/* User home screen (for authenticated users) */}
      <Stack.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{ headerShown: false }}
      />
      {/* Match detail screen */}
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}