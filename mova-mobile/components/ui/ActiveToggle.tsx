import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ActiveToggleProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
}

export default function ActiveToggle({ isActive, onToggle }: ActiveToggleProps) {
  const toggleAnimation = new Animated.Value(isActive ? 1 : 0);

  const handleToggle = () => {
    const newValue = !isActive;
    onToggle(newValue);
    
    Animated.timing(toggleAnimation, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const switchTranslate = toggleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 16],
  });

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {isActive ? 'Actif' : 'Inactif'}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.switchContainer} 
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        <View style={[styles.switchBackground, !isActive && styles.inactiveBackground]}>
          {isActive && (
            <LinearGradient
              colors={['#6746a8', '#6b25f9', '#07b9ff']}
              style={styles.gradientBackground}
            />
          )}
          <Animated.View 
            style={[
              styles.switchCircle,
              { transform: [{ translateX: switchTranslate }] }
            ]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  labelContainer: {
    width: 55,
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  switchContainer: {
    padding: 1,
  },
  switchBackground: {
    width: 38,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  inactiveBackground: {
    backgroundColor: '#e0e0e0',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 11,
  },
  switchCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    position: 'absolute',
    zIndex: 1,
  },
});