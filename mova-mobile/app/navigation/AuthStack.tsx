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

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
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
        component={HomeScreen} // Page d'accueil pour les non-connectés
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
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="RecruiterProfile"
        component={RecruiterProfileScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="HistoricalScreen"
        component={HistoricalScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="SwipeNotification"
        component={SwipeNotificationScreen}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen
        name="CandidateCVScreen"
        component={CandidateCVScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
      <Stack.Screen
        name="RecruiterJobOfferScreen"
        component={RecruiterJobOfferScreen}
        options={({ navigation }) => ({
          headerLeft: () => <MovaLogo sizeProp={40} />,
          headerRight: () => <HomeButton onPress={() => navigation.navigate('UserHome')} />,
          headerBackTitleVisible: false,
        })}
      />
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
      <Stack.Screen
        name="UserHome"
        component={UserHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MatchDetail"
        component={MatchDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}