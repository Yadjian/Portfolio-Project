import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface NotificationButtonProps {
  notificationCount: number;
  onPress: () => void;
}

export default function NotificationButton({ notificationCount, onPress }: NotificationButtonProps) {
  const { width, height } = useWindowDimensions();
  
  // Tailles dynamiques basées sur les dimensions de l'écran
  const iconSize = Math.max(18, width * 0.05); // Taille d'icône adaptative
  const containerSize = Math.max(26, width * 0.07); // Taille du conteneur
  const badgeSize = Math.max(16, width * 0.04); // Taille du badge
  const fontSize = Math.max(9, width * 0.025); // Taille de police
  const padding = Math.max(6, width * 0.02); // Padding adaptatif

  const dynamicStyles = {
    container: {
      position: 'relative' as const,
      padding: padding,
      marginRight: width * 0.025,
    },
    iconContainer: {
      width: containerSize,
      height: containerSize,
      borderRadius: containerSize / 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    gradientBackground: {
      width: containerSize,
      height: containerSize,
      borderRadius: containerSize / 2,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    badge: {
      position: 'absolute' as const,
      top: 1,
      right: 1,
      backgroundColor: '#ff4757',
      borderRadius: badgeSize / 2,
      minWidth: badgeSize,
      height: badgeSize,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      borderWidth: 2,
      borderColor: '#fff',
    },
    badgeText: {
      color: '#fff',
      fontSize: fontSize,
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
    },
  };

  return (
    <TouchableOpacity style={dynamicStyles.container} onPress={onPress}>
      <View style={dynamicStyles.iconContainer}>
        <LinearGradient
          colors={['#6746a8', '#6b25f9', '#07b9ff']}
          style={dynamicStyles.gradientBackground}
        >
          <Ionicons 
            name="notifications" 
            size={iconSize} 
            color="#FFFFFF" 
          />
        </LinearGradient>
      </View>
      {notificationCount > 0 && (
        <View style={dynamicStyles.badge}>
          <Text style={dynamicStyles.badgeText}>
            {notificationCount > 99 ? '99+' : notificationCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

