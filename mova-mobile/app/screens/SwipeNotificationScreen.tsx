import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Changed from Ionicons
import SwipeCard from '@/components/ui/SwipeCard';
import BottomTabBar from '@/components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';
import { UserType } from '@/lib/types';
import { getProfilesToSwipe } from '../../services/api';
import Colors from '@/constants/Colors'; // Import our new colors

const { width } = Dimensions.get('window');

// ActionButton stylisé façon pro (LinkedIn/Indeed)
const ActionButton = ({ onPress, small, color, icon, style }: {
  onPress: () => void;
  small?: boolean;
  color: string;
  icon: keyof typeof Feather.glyphMap;
  style?: any;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[
      styles.button,
      small ? styles.smallButton : styles.largeButton,
      {
        backgroundColor: '#fff',
        shadowColor: color,
        borderWidth: 2,
        borderColor: color,
        elevation: 8,
      },
      style,
    ]}
  >
    <Feather name={icon} size={small ? 24 : 32} color={color} />
  </TouchableOpacity>
);

export default function SwipeNotificationScreen({ route, navigation }: any) {
  const userType: UserType = route?.params?.userType ?? 'candidate'; // On garde cette ligne, qui est la bonne

  const [profiles, setProfiles] = useState<any[]>([]);
  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getProfilesToSwipe();
        setProfiles(data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des profils à swiper:", error);
        setProfiles([]);
      }
    };
    fetchProfiles();
  }, []);

  // --- All the logic (tabs, panResponder, animations) remains the same ---
  const baseTabs = userType === 'recruiter' ? getRecruiterTabs(navigation, 0) : getCandidateTabs(navigation, 0);
  const tabs = baseTabs.map(tab => 
    tab.id === 'notifications' 
      ? { ...tab, onPress: () => {} } // Désactive le clic sur l'onglet actif
      : tab
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }), // Seulement dx, pas dy
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          swipe('right');
        } else if (gesture.dx < -120) {
          swipe('left');
        } else {
          resetPosition();
        }
      },
    })
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const animatedStyle = {
    transform: [{ translateX: position.x }], // Pas de rotation, juste translation horizontale
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false, // Needs to be false for spring if not fully supported
      friction: 5,
    }).start();
  };

  const swipe = (direction: 'right' | 'left') => {
    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width * 1.5 : -width * 1.5, y: 0 },
      duration: 400,
      useNativeDriver: false, // Needs to be false for this to work reliably with setValue
    }).start(() => {
      setProfiles(prevProfiles => prevProfiles.slice(1));
      position.setValue({ x: 0, y: 0 });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        {profiles.length > 0 ? (
          profiles.map((profile, index) => {
            if (index === 0) {
              return (
                <Animated.View
                  key={profile.id}
                  style={[styles.card, animatedStyle]}
                  {...panResponder.panHandlers}
                >
                  <SwipeCard userType={userType === 'candidate' ? 'recruiter' : 'candidate'} {...profile} />
                </Animated.View>
              );
            }
            // Ne pas afficher la carte suivante
            return null;
          }).reverse()
        ) : (
          <View style={styles.noMoreProfiles}>
            <Feather name="briefcase" size={80} color={Colors.light.textSecondary} />
            <Text style={styles.noMoreProfilesText}>Plus de profils pour le moment</Text>
          </View>
        )}
      </View>

      {/* --- Re-styled Footer --- */}
      <View style={styles.footer}>
        <ActionButton icon="x" color={Colors.light.error} onPress={() => swipe('left')} />
        <ActionButton icon="refresh-cw" color={Colors.light.textSecondary} small onPress={() => { /* TODO: Implement refresh logic */ }} style={{ marginTop: 15 }} />
        <ActionButton icon="check" color={Colors.light.accent} onPress={() => swipe('right')} />
      </View>
      <BottomTabBar tabs={tabs} activeTabId="notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // Use new background color
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: width * 0.95, // Carte plus large
    top: 80, // Descend un peu la carte
  },
  behindCard: {
    // Style for cards that are behind the top one to create a deck effect
    transform: [{ scale: 0.95 }],
    top: -10,
  },
  noMoreProfiles: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMoreProfilesText: {
    fontSize: 18,
    color: Colors.light.textSecondary,
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 140, // Remonte un peu les boutons
    backgroundColor: 'transparent',
  },
  button: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    marginHorizontal: 10,
    // borderWidth et borderColor sont ajoutés dynamiquement
    // backgroundColor aussi
    // elevation aussi
  },
  smallButton: {
    width: 54,
    height: 54,
  },
  largeButton: {
    width: 72,
    height: 72,
  },
});