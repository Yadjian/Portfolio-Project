import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Fonction pour obtenir l'URL du backend
export const getApiUrl = () => {
  return 'https://tubular-verna-telegraphically.ngrok-free.dev'; // ← Mettez ici votre URL ngrok
};

export type UserType = 'candidate' | 'recruiter';

// Définir les types des paramètres pour AuthStack
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

// Définir les props pour chaque écran
export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Home'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type ChooseRegisterTypeScreenProps = NativeStackScreenProps<AuthStackParamList, 'ChooseRegisterType'>;
export type CandidateProfileScreenProps = NativeStackScreenProps<AuthStackParamList, 'CandidateProfile'>;
export type RecruiterProfileScreenProps = NativeStackScreenProps<AuthStackParamList, 'RecruiterProfile'>;
