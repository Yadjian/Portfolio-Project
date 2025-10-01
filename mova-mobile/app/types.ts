import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Définir les types des paramètres pour AuthStack
export type AuthStackParamList = {
  Welcome: undefined; // Pas de paramètres pour Welcome
  Login: undefined; // Pas de paramètres pour l'écran Login
  Register: undefined; // Pas de paramètres pour l'écran Register
};

// Définir les props pour LoginScreen
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

// Définir les props pour RegisterScreen
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Register'>;

