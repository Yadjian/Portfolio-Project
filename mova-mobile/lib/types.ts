import { NativeStackScreenProps } from '@react-navigation/native-stack';

/**
 * types.ts
 *
 * Centralizes TypeScript types and navigation parameter lists for the app.
 *
 * Main features:
 * - Exports the backend API URL getter.
 * - Defines user types and navigation stack parameter types.
 * - Provides screen prop types for type-safe navigation.
 *
 * Usage:
 *   import { AuthStackParamList, UserType, LoginScreenProps } from '@/lib/types';
 */

/**
 * Get the backend API URL
 * 
 * Reads the ngrok URL from environment variables.
 * Update EXPO_PUBLIC_API_URL in mova-mobile/.env when the ngrok tunnel changes.
 * 
 * @returns Backend API base URL
 */
export const getApiUrl = () => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    console.warn('EXPO_PUBLIC_API_URL not set in .env, using default');
    return 'https://YOUR_NGROK_URL_HERE.ngrok-free.dev';
  }
  return url;
};

/**
 * User type definition
 * 
 * Represents the two types of users in the application:
 * - candidate: Job seeker
 * - recruiter: Employer/hiring manager
 */
export type UserType = 'candidate' | 'recruiter';

/**
 * Authentication Stack Parameter List
 * 
 * Defines all screens in the authentication navigation stack
 * and their required/optional parameters for type-safe navigation.
 */
export type AuthStackParamList = {
  Home: undefined;
  Login: undefined;
  ChooseRegisterType: undefined;
  CandidateProfile: { startEditing?: boolean };
  RecruiterProfile: { startEditing?: boolean };
  SwipeNotification: { userType: UserType };
  EditProfileScreen: { userType: UserType; userId: string; startEditing?: boolean; companyName?: string; };
  RecruiterOnboarding: { userId: string; };
  CreateCompany: { userId: string; };
  JoinCompany: undefined;
  CandidateCVScreen: undefined;
  RecruiterJobOfferScreen: undefined;
  CreateAccount: { userType: 'candidate' | 'recruiter' };
  UserHome: undefined;
  HistoricalScreen: undefined;
  MatchDetail: { matchId: string; userType: UserType };
};

/**
 * Screen Props Type Definitions
 * 
 * Pre-defined prop types for each screen in the AuthStack.
 * These types provide type-safe access to navigation and route params.
 */
export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Home'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type ChooseRegisterTypeScreenProps = NativeStackScreenProps<AuthStackParamList, 'ChooseRegisterType'>;
export type CandidateProfileScreenProps = NativeStackScreenProps<AuthStackParamList, 'CandidateProfile'>;
export type RecruiterProfileScreenProps = NativeStackScreenProps<AuthStackParamList, 'RecruiterProfile'>;
