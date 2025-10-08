import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ActiveToggleProps {
  initialValue?: boolean;
  onToggle: (value: boolean) => void;
}

export default function ActiveToggle({ 
  initialValue = false, 
  onToggle 
}: ActiveToggleProps) {
  const { width, height } = useWindowDimensions();
  const [isActive, setIsActive] = useState(initialValue);
  const animatedValue = useState(new Animated.Value(initialValue ? 1 : 0))[0];

  // Tailles dynamiques basées sur la largeur de l'écran - AGRANDIES
  const switchWidth = width * 0.12;
  const switchHeight = switchWidth * 0.55;
  const circleSize = switchHeight * 0.8;
  const labelWidth = width * 0.16;
  const fontSize = width * 0.038;

  useEffect(() => {
    setIsActive(initialValue);
    animatedValue.setValue(initialValue ? 1 : 0);
  }, [initialValue]);

  const handleToggle = () => {
    const newValue = !isActive;
    setIsActive(newValue);
    onToggle(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const switchTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, switchWidth - circleSize - 2],
  });

  const containerStyle = {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: height * 0.008,
  };

  const labelContainerStyle = {
    width: labelWidth,
    marginRight: width * 0.015,
  };

  const labelStyle = {
    fontSize: fontSize,
    fontWeight: '600' as const,
    color: '#6b25f9', // Texte violet
  };

  const switchBackgroundStyle = {
    width: switchWidth,
    height: switchHeight,
    borderRadius: switchHeight / 2,
    justifyContent: 'center' as const,
    position: 'relative' as const,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: '#fff',
  };

  const switchCircleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
    position: 'absolute' as const,
    zIndex: 1,
  };

  return (
    <View style={containerStyle}>
      <View style={labelContainerStyle}>
        <Text style={labelStyle}>
          {isActive ? 'Actif' : 'Inactif'}
        </Text>
      </View>
      <TouchableOpacity
        style={{ padding: 1 }}
        onPress={handleToggle}
        activeOpacity={0.8}
      >
        {isActive ? (
          <LinearGradient
            colors={['#6746a8', '#6b25f9', '#07b9ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={switchBackgroundStyle}
          >
            <Animated.View
              style={[
                switchCircleStyle,
                { transform: [{ translateX: switchTranslate }] }
              ]}
            />
          </LinearGradient>
        ) : (
          <View style={[switchBackgroundStyle, { backgroundColor: '#7e7e7e' }]}>
            <Animated.View
              style={[
                switchCircleStyle,
                { transform: [{ translateX: switchTranslate }] }
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}