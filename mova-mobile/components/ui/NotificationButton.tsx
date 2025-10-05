import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface NotificationButtonProps {
  notificationCount: number;
  onPress: () => void;
}

export default function NotificationButton({ notificationCount, onPress }: NotificationButtonProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={['#6746a8', '#6b25f9', '#07b9ff']}
          style={styles.gradientBackground}
        >
          <Ionicons 
            name="notifications" 
            size={20} 
            color="#FFFFFF" 
          />
        </LinearGradient>
      </View>
      {notificationCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {notificationCount > 99 ? '99+' : notificationCount.toString()}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    padding: 8,
    marginRight: 10,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});