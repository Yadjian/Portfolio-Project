import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface TabItem {
  id: string;
  iconName: any;
  iconNameActive: any;
  label: string;
  onPress: () => void;
}

interface BottomTabBarProps {
  tabs: TabItem[];
  activeTabId: string;
}

export default function BottomTabBar({ tabs, activeTabId }: BottomTabBarProps) {
  const { width, height } = useWindowDimensions();
  
  // Tailles dynamiques basées sur les dimensions de l'écran
  const iconSize = Math.max(20, width * 0.065); // AGRANDI : Au moins 20px, plus adaptatif
  const fontSize = Math.max(8, width * 0.022); // Au moins 8px pour la police
  const containerHeight = Math.max(65, height * 0.09); // Au moins 65px pour la hauteur
  const iconContainerSize = Math.max(28, width * 0.070); // AGRANDI aussi le conteneur
  const paddingHorizontal = width * 0.05;
  const paddingVertical = height * 0.01;

  const dynamicStyles = {
    bottomNavigation: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row' as const,
      backgroundColor: '#FFFFFF',
      paddingTop: paddingVertical,
      paddingBottom: Math.max(paddingVertical, 12),
      paddingHorizontal: paddingHorizontal,
      borderTopWidth: 0.5,
      borderTopColor: '#E5E5EA',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      minHeight: containerHeight,
    },
    navItem: {
      flex: 1,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      paddingVertical: paddingVertical * 0.3,
    },
    navIconContainer: {
      width: iconContainerSize,
      height: iconContainerSize,
      borderRadius: iconContainerSize / 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      marginBottom: 2,
    },
    activeIconGradient: {
      width: iconContainerSize,
      height: iconContainerSize,
      borderRadius: iconContainerSize / 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    navText: {
      fontSize: fontSize,
      color: '#8E8E93',
      fontWeight: '500' as const,
      textAlign: 'center' as const,
    },
    activeNavText: {
      color: '#6746a8',
      fontWeight: '600' as const,
    },
  };

  return (
    <View style={dynamicStyles.bottomNavigation}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        
        // Si c'est le bouton home, utiliser l'icône maison
        const iconName = tab.id === 'home' ? 'home-outline' : tab.iconName;
        const iconNameActive = tab.id === 'home' ? 'home' : tab.iconNameActive;
        
        return (
          <TouchableOpacity 
            key={tab.id}
            style={dynamicStyles.navItem} 
            onPress={tab.onPress}
          >
            <View style={dynamicStyles.navIconContainer}>
              {isActive ? (
                <LinearGradient
                  colors={['#6746a8', '#6b25f9', '#07b9ff']}
                  style={dynamicStyles.activeIconGradient}
                >
                  <Ionicons 
                    name={iconNameActive} 
                    size={iconSize} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
              ) : (
                <Ionicons 
                  name={iconName} 
                  size={iconSize} 
                  color="#8E8E93" 
                />
              )}
            </View>
            <Text style={[
              dynamicStyles.navText,
              isActive && dynamicStyles.activeNavText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

