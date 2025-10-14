import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Définir les types des paramètres pour AuthStack
export type AuthStackParamList = {
  Home: undefined;
  Login: undefined;
  ChooseRegisterType: undefined;
  CandidateProfile: { startEditing?: boolean };
  RecruiterProfile: { startEditing?: boolean };
  SwipeNotification: { userType: string };
  EditProfileScreen: { userType: 'candidat' | 'recruteur' };
  RecruiterOnboarding: undefined;
  CreateCompany: undefined;
  JoinCompany: undefined;
  CandidateCVScreen: undefined;
  RecruiterJobOfferScreen: undefined;
};

// Définir les props pour chaque écran
export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Home'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type ChooseRegisterTypeScreenProps = NativeStackScreenProps<AuthStackParamList, 'ChooseRegisterType'>;
export type CandidateProfileScreenProps = NativeStackScreenProps<AuthStackParamList, 'CandidateProfile'>;
export type RecruiterProfileScreenProps = NativeStackScreenProps<AuthStackParamList, 'RecruiterProfile'>;


