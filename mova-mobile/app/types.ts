import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Définir les types des paramètres pour AuthStack
export type AuthStackParamList = {
  Welcome: undefined; // Pas de paramètres pour Welcome
  Login: undefined; // Pas de paramètres pour l'écran Login
  RegisterCandidate: undefined;
  RegisterRecruiter: undefined;
  ChooseRegisterType: undefined;
};

// Définir les props pour chaque écran
export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;
export type ChooseRegisterTypeScreenProps = NativeStackScreenProps<AuthStackParamList, 'ChooseRegisterType'>;
export type RegisterCandidateScreenProps = NativeStackScreenProps<AuthStackParamList, 'RegisterCandidate'>;
export type RegisterRecruiterScreenProps = NativeStackScreenProps<AuthStackParamList, 'RegisterRecruiter'>;


