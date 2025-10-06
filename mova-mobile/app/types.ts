import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Définir les types des paramètres pour AuthStack
export type AuthStackParamList = {
  Welcome: undefined; // Pas de paramètres pour Welcome
  Login: undefined; // Pas de paramètres pour l'écran Login
  ChooseRegisterType: undefined;
  CandidateProfile: undefined;
  RecruiterProfile: undefined;
  SwipeNotification: { userType: 'candidat' | 'recruteur' } | undefined;
};

// Définir les props pour chaque écran
export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type ChooseRegisterTypeScreenProps = NativeStackScreenProps<AuthStackParamList, 'ChooseRegisterType'>;
export type CandidateProfileScreenProps = NativeStackScreenProps<AuthStackParamList, 'CandidateProfile'>;
export type RecruiterProfileScreenProps = NativeStackScreenProps<AuthStackParamList, 'RecruiterProfile'>;


