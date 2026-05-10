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
    notification: {
      icon: './assets/images/icon.png',
      color: '#FF6347',
      androidMode: 'default',
      androidCollapsedTitle: 'Mova',
    },
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
        // Utiliser la clé unique pour dev : GOOGLE_PLACES_API_KEY
        googleMapsApiKey: process.env.GOOGLE_PLACES_API_KEY,
      },
    },
    android: {
      ...config.android,
      useNextNotificationsApi: true,
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      config: {
        ...config.android?.config,
        googleMaps: {
          // Utiliser la clé unique pour dev : GOOGLE_PLACES_API_KEY
          apiKey: process.env.GOOGLE_PLACES_API_KEY,
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
      EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
      GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
      eas: {
        projectId: '23a311f7-7e03-4f55-9b02-1e3a69c073f5'
      }
    },
  },
});