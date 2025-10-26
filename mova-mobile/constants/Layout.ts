import { Dimensions, Platform, StatusBar } from 'react-native';

/**
 * Layout.ts
 *
 * Centralizes layout-related constants and helpers for responsive design.
 *
 * Main features:
 * - Exposes window width and height for responsive layouts.
 * - Provides status bar height for proper spacing (iOS/Android).
 * - Detects small devices for conditional UI adjustments.
 *
 * Usage:
 *   import Layout from '@/constants/Layout';
 *   Layout.window.width, Layout.statusBarHeight, Layout.isSmallDevice, etc.
 */

const { width, height } = Dimensions.get('window');

// Function to get status bar height for spacing adjustments
const getStatusBarHeight = () => {
  if (Platform.OS === 'ios') {
    return 20; // Default for iOS
  }
  return StatusBar.currentHeight || 0; // Android
};

export default {
  window: {
    width,
    height,
  },
  statusBarHeight: getStatusBarHeight(),
  isSmallDevice: width < 375, // Detects small devices for responsive UI
};
