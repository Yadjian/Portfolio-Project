import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// Fonction pour gérer les hauteurs dynamiques en tenant compte des barres de statut
const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return 20; // Valeur par défaut pour iOS
  }
  return StatusBar.currentHeight || 0; // Valeur pour Android
};

export default {
  window: {
    width,
    height,
  },
  statusBarHeight: getStatusBarHeight(),
  isSmallDevice: width < 375, // Détecte les petits appareils
};