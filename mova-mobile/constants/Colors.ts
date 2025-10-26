/**
 * Colors.ts
 *
 * Centralized color palette for the app, supporting both light and dark themes.
 *
 * Main features:
 * - Defines all main colors for light and dark mode.
 * - Used by Themed.tsx and throughout the app for consistent styling.
 * - Makes it easy to update or customize the color scheme for dark mode later.
 *
 * Usage:
 *   import Colors from '@/constants/Colors';
 *   Colors.light.text, Colors.dark.background, etc.
 */

const primary = '#0A66C2'; // Professional Blue (like LinkedIn)
const accent = '#34D399'; // A modern green for accents and success
const error = '#EF4444'; // A standard red for errors
const lightGrey = '#F3F4F6'; // Light grey for backgrounds
const mediumGrey = '#9CA3AF'; // Medium grey for secondary text and borders
const darkGrey = '#1F2937';  // Dark grey for primary text

export default {
  light: {
    text: darkGrey,
    textSecondary: mediumGrey,
    background: lightGrey,
    backgroundCard: '#FFFFFF',
    tint: primary,
    tabIconDefault: mediumGrey,
    tabIconSelected: primary,
    primary: primary,
    accent: accent,
    error: error,
    border: '#E5E7EB', // Lighter grey for borders
  },
  dark: {
    // Modern dark theme colors
    text: '#FFFFFF',
    textSecondary: mediumGrey,
    background: '#111827', // Very dark blue/grey
    backgroundCard: '#1F2937', // Slightly lighter dark blue/grey
    tint: '#FFFFFF',
    tabIconDefault: mediumGrey,
    tabIconSelected: '#FFFFFF',
    primary: primary,
    accent: accent,
    error: error,
    border: '#374151', // Darker border color
  },
};
