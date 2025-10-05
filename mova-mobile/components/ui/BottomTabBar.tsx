import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
  return (
    <View style={styles.bottomNavigation}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        
        // Si c'est le bouton home, utiliser l'icône maison
        const iconName = tab.id === 'home' ? 'home-outline' : tab.iconName;
        const iconNameActive = tab.id === 'home' ? 'home' : tab.iconNameActive;
        
        return (
          <TouchableOpacity 
            key={tab.id}
            style={styles.navItem} 
            onPress={tab.onPress}
          >
            <View style={styles.navIconContainer}>
              {isActive ? (
                <LinearGradient
                  colors={['#6746a8', '#6b25f9', '#07b9ff']}
                  style={styles.activeIconGradient}
                >
                  <Ionicons 
                    name={iconNameActive} 
                    size={18} 
                    color="#FFFFFF" 
                  />
                </LinearGradient>
              ) : (
                <Ionicons 
                  name={iconName} 
                  size={18} 
                  color="#8E8E93" 
                />
              )}
            </View>
            <Text style={[
              styles.navText,
              isActive && styles.activeNavText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  navIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeIconGradient: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 9,
    color: '#8E8E93',
    fontWeight: '500',
    textAlign: 'center',
  },
  activeNavText: {
    color: '#6746a8',
    fontWeight: '600',
  },
});