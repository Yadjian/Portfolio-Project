import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabItem {
  id: string;
  label: string;
  onPress: () => void;
  iconName?: any;
  iconNameActive?: any;
  badge?: number;
}

interface BottomTabBarProps {
  tabs: TabItem[];
  activeTabId: string;
}

export default function BottomTabBar({ tabs, activeTabId }: BottomTabBarProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  const iconSize = Math.max(20, width * 0.065);
  const fontSize = Math.max(8, width * 0.022);
  const containerHeight = Math.max(65, height * 0.09);
  const iconContainerSize = Math.max(28, width * 0.070);
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
      paddingHorizontal: paddingHorizontal,
      borderTopWidth: 0.5,
      borderTopColor: '#E5E5EA',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
      minHeight: containerHeight,
      paddingBottom: insets.bottom > 0 ? insets.bottom : Math.max(paddingVertical, 12),
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
      color: '#4930a3',
      fontWeight: '600' as const,
    },
  };

  return (
    <View style={dynamicStyles.bottomNavigation}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        
        const getIconsForTab = (tabId: string) => {
          switch (tabId) {
            case 'profile':
              return { iconName: 'card-outline', iconNameActive: 'card' };
            case 'cv':
              return { iconName: 'document-text-outline', iconNameActive: 'document-text' };
            case 'offre':
              return { iconName: 'briefcase-outline', iconNameActive: 'briefcase' };
            case 'matches':
              return { iconName: 'heart-outline', iconNameActive: 'heart' };
            case 'notifications':
              return { iconName: 'notifications-outline', iconNameActive: 'notifications' };
            default:
              return { iconName: tab.iconName, iconNameActive: tab.iconNameActive };
          }
        };
        
        const { iconName, iconNameActive } = getIconsForTab(tab.id);
        
        return (
          <TouchableOpacity 
            key={tab.id}
            style={dynamicStyles.navItem} 
            onPress={tab.onPress}
          >
            <View style={dynamicStyles.navIconContainer}>
              {isActive ? (
                <View
                  style={[dynamicStyles.activeIconGradient, { backgroundColor: '#4930a3' }]}
                >
                  <Ionicons 
                    name={iconNameActive} 
                    size={iconSize} 
                    color="#FFFFFF" 
                  />
                </View>
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
            {typeof tab.badge === 'number' && tab.badge > 0 && (
              <View style={{
                position: 'absolute',
                top: -4,
                right: -8,
                backgroundColor: 'red',
                borderRadius: 10,
                paddingHorizontal: 5,
                minWidth: 18,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}>
                <Text style={{
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>{tab.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
