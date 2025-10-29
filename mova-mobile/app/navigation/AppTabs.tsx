import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreens/CandidateProfileScreen';

/**
 * AppTabs
 *
 * This file defines the main bottom tab navigation for the app using React Navigation.
 *
 * Main features:
 * - Sets up two tabs: Home and Profile, each linked to their respective screens.
 * - Each Tab.Screen represents a tab in the bottom navigation bar.
 *
 * Key logic:
 * - Uses createBottomTabNavigator to manage tab navigation.
 * - Can be extended to add more tabs or customize tab icons.
 */

// Create the bottom tab navigator instance
const Tab = createBottomTabNavigator();

// Main component that renders the tab navigator
export default function AppTabs() {
  return (
    <Tab.Navigator>
      {/* Home tab, links to the HomeScreen */}
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* Profile tab, links to the CandidateProfileScreen */}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
