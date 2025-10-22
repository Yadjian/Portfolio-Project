import 'dotenv/config';

export default {
  expo: {
    name: 'mova-mobile',
    slug: 'mova-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'movamobile',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.stas.mova',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.stas.mova',
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', 'expo-secure-store', 'expo-font'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // C'est ici qu'on rend les clés disponibles dans l'application
      googlePlacesApiKeyAndroid: process.env.GOOGLE_PLACES_API_KEY_ANDROID,
      googlePlacesApiKeyIos: process.env.GOOGLE_PLACES_API_KEY_IOS,
      eas: {
        projectId: '23a311f7-7e03-4f55-9b02-1e3a69c073f5'
      }
    },
  },
};