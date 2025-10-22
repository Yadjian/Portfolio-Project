import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: 'mova-mobile', // Vous pouvez garder ces valeurs si elles ne sont pas dans le app.json de base
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
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: 'com.stas.mova',
      config: {
        ...config.ios?.config,
        googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY_IOS, // Nouveau nom, correspond à .env
      },
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      config: {
        ...config.android?.config,
        googleMaps: {
          apiKey: process.env.GOOGLE_PLACES_API_KEY_ANDROID, // Nouveau nom, correspond à .env
        },
      },
      package: 'com.stas.mova',
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      ...config.web,
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [...(config.plugins || []), 'expo-router', 'expo-secure-store', 'expo-font'],
    experiments: { ...config.experiments, typedRoutes: true },
    extra: {
      ...config.extra,
      // C'est ici qu'on rend les clés disponibles dans l'application
      googlePlacesApiKeyAndroid: process.env.GOOGLE_PLACES_API_KEY_ANDROID, // Nouveau nom, correspond à .env
      googlePlacesApiKeyIos: process.env.GOOGLE_PLACES_API_KEY_IOS,     // Nouveau nom, correspond à .env
      eas: {
        projectId: '23a311f7-7e03-4f55-9b02-1e3a69c073f5'
      }
    },
  },
});