import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * NotificationButton
 *
 * A reusable notification bell button with a badge for unread notifications.
 *
 * Main features:
 * - Renders a bell icon with a gradient background.
 * - Displays a badge with the notification count if > 0.
 * - Dynamically sizes icon, badge, and container based on screen width.
 * - Calls the onPress callback when pressed.
 *
 * Props:
 * - notificationCount: number — number of unread notifications.
 * - onPress: () => void — function to call when the button is pressed.
 *
 * Key logic:
 * - Responsive sizing for icon, badge, and container.
 * - Shows "99+" if notificationCount > 99.
 */

interface NotificationButtonProps {
  notificationCount: number;
  onPress: () => void;
}

export default function NotificationButton({ notificationCount, onPress }: NotificationButtonProps) {
  const { width, height } = useWindowDimensions();
  
  // Dynamic sizes based on screen width
  const iconSize = Math.max(20, width * 0.055);
  const containerSize = Math.max(28, width * 0.075);
  const badgeSize = Math.max(16, width * 0.04);
  const fontSize = Math.max(9, width * 0.025);
  const padding = Math.max(6, width * 0.02);

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
