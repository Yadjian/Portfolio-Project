import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Animated, PanResponder, TouchableOpacity, Text, Alert, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import SwipeCard from '@/components/ui/SwipeCard';
import BottomTabBar from '@/components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';
import { UserType } from '@/lib/types';
import { getProfilesToSwipe, sendSwipeAction, undoPreviousSwipe } from '../../services/api';
import Colors from '@/constants/Colors';
import { useNotifications } from '@/contexts/NotificationContext';

/**
 * SwipeNotificationScreen
 * 
 * This screen implements the "swipe" experience (like Tinder) for both candidates and recruiters.
 * - Candidates swipe on recruiter/company profiles (job offers).
 * - Recruiters swipe on candidate profiles.
 * 
 * Main features:
 * - Fetches profiles to swipe based on user type and geolocation.
 * - Displays one profile at a time as a card, with swipe gestures (left = "nope", right = "like").
 * - Handles swipe animations and sends swipe actions to the backend.
 * - Allows undoing the last swipe.
 * - Shows a bottom tab bar for navigation.
 * 
 * Key logic:
 * - Uses PanResponder and Animated for swipe gestures and card animations.
 * - Fetches profiles from the backend (with a mock profile for demo/testing).
 * - Maps backend data to the UI card format.
 * - Handles swipe actions (API call + animation + removing card from stack).
 * - Handles undo (API call + restoring previous card).
 * - Shows a message when there are no more profiles to swipe.
 */

// ActionButton: UI component for swipe/undo buttons
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
    <Feather name={icon} size={small ? 20 : 26} color={color} />
  </TouchableOpacity>
);

export default function SwipeNotificationScreen({ route, navigation }: any) {
  // userType: 'candidate' or 'recruiter'
  const userType: UserType = route?.params?.userType ?? 'candidate';
  const { width } = useWindowDimensions();
  
  // Get notification context
  const { matchBadgeCount, profileBadgeCount, setProfileBadgeCount, refreshMatchBadge, refreshProfileBadge, simulateMatchNotification } = useNotifications();

  const dynamicStyles = StyleSheet.create({
    card: {
      position: 'absolute',
      width: width * 0.96,
      top: 40,
      bottom: 190,
      zIndex: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 10,
    },
  });

  // profiles: stack of profiles to swipe
  const [profiles, setProfiles] = useState<any[]>([]);
  // lastSwipedProfile: for undo functionality
  const [lastSwipedProfile, setLastSwipedProfile] = useState<any | null>(null);
  // isAnimating: prevents multiple swipes at once
  const [isAnimating, setIsAnimating] = useState(false);
  // notificationCount: number of profiles available to swipe
  const [notificationCount, setNotificationCount] = useState(0);
  // animatingProfile: profile currently being animated out
  const [animatingProfile, setAnimatingProfile] = useState<any | null>(null);
  // position: animated value for swipe gesture
  const position = useRef(new Animated.ValueXY()).current;
  // panResponderRef: PanResponder for swipe gestures
  const panResponderRef = useRef<any>(null);

  // Fetch profiles to swipe on mount
  useEffect(() => {
    const getLocationAndFetchProfiles = async () => {
      // Request geolocation permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setProfiles([]);
        setNotificationCount(0);
        return;
      }

      try {
        // Get current location
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Fetch profiles from backend
        const data = await getProfilesToSwipe(userType, latitude, longitude);

        const allProfiles: any[] = [];

        // Map backend profiles to UI format
        if (data && data.length > 0) {
          const mappedProfiles = data.map((profile: any) => {
            if (userType === 'candidate') {
              // Candidate sees recruiters
              const descriptionParts = profile.searchDescription ? profile.searchDescription.split('\n\n') : [];
              const jobTitle = descriptionParts[0] || 'Poste non spécifié';
              const description = descriptionParts.slice(1).join('\n\n') || 'Aucune présentation disponible';
              return {
                ...profile,
                avatarUrl: profile.avatarUrl || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=200&background=4930a3&color=fff`,
                location: profile.locationName || 'Localisation non spécifiée',
                jobSeeking: jobTitle,
                experienceRequired: profile.desiredExperienceLevel || 'Non spécifié',
                presentation: description,
                companyName: profile.companyName || `Entreprise de ${profile.firstName} ${profile.lastName}`,
                contractType: profile.desiredContractTypes && profile.desiredContractTypes.length > 0 
                  ? profile.desiredContractTypes.join(', ') 
                  : 'Non spécifié',
              };
            } else {
              // Recruiter sees candidates
              const jobTitle = profile.desiredJobTitle || 'Poste non spécifié';
              const description = profile.coverLetterText || 'Aucune présentation disponible';
              return {
                ...profile,
                avatarUrl: profile.photoUrl || `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&size=200&background=4930a3&color=fff`,
                location: profile.locationName || 'Localisation non spécifiée',
                job: jobTitle,
                experience: profile.experienceLevel || 'Non spécifié',
                presentation: description,
                contractType: profile.desiredContractTypes && profile.desiredContractTypes.length > 0 
                  ? profile.desiredContractTypes.join(', ') 
                  : 'Non spécifié',
              };
            }
          });
          allProfiles.push(...mappedProfiles);
        }

        setProfiles(allProfiles.length > 0 ? allProfiles : []);
        setNotificationCount(allProfiles.length);
        
        await refreshProfileBadge(allProfiles.length);
        
        await refreshMatchBadge();
      } catch (error) {
        setProfiles([]);
        setNotificationCount(0);
      }
    };

    getLocationAndFetchProfiles();
  }, []);

  // Tab bar configuration
  const baseTabs = userType === 'recruiter' ? getRecruiterTabs(navigation, profileBadgeCount) : getCandidateTabs(navigation, profileBadgeCount);
  const tabs = baseTabs.map(tab => {
    if (tab.id === 'notifications') {
      return { ...tab, onPress: () => {} };
    }
    if (tab.id === 'matches') {
      return { ...tab, badge: matchBadgeCount };
    }
    return tab;
  });

  // Reset card position if not swiped enough
  const resetPosition = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 5,
    }).start();
  }, [position]);

  // Handle swipe action (left/right)
  const swipe = useCallback((direction: 'right' | 'left') => {
    setIsAnimating(prev => {
      if (prev) return prev;
      return true;
    });

    setProfiles(currentProfiles => {
      const currentProfile = currentProfiles[0];
      if (!currentProfile) {
        setIsAnimating(false);
        return currentProfiles;
      }

      setAnimatingProfile(currentProfile);

      const action = direction === 'right' ? 'RIGHT' : 'LEFT';

      // Send swipe action to backend
      sendSwipeAction(currentProfile.id, action)
        .then(response => {
          if (response && response.match) {
            Alert.alert("C'est un Match !");
          }
        })
        .catch(() => {
        });

      // Animate card out
      Animated.timing(position, {
        toValue: { x: direction === 'right' ? width * 1.5 : -width * 1.5, y: 0 },
        duration: 600,
        useNativeDriver: false,
      }).start(() => {
        setLastSwipedProfile(currentProfile);
        setProfiles(prevProfiles => {
          const newProfiles = prevProfiles.slice(1);
          setNotificationCount(newProfiles.length);
          refreshProfileBadge(newProfiles.length);
          return newProfiles;
        });
        position.setValue({ x: 0, y: 0 });
        setIsAnimating(false);
        setAnimatingProfile(null);
      });

      return currentProfiles;
    });
  }, [position]);

  // PanResponder for swipe gestures
  if (!panResponderRef.current) {
    panResponderRef.current = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          swipe('right');
        } else if (gesture.dx < -120) {
          swipe('left');
        } else {
          resetPosition();
        }
      },
    });
  }
  const panResponder = panResponderRef.current;

  // Animation interpolations for card rotation and labels
  const rotate = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });
  const likeOpacity = position.x.interpolate({
    inputRange: [0, width / 4],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const nopeOpacity = position.x.interpolate({
    inputRange: [-width / 4, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const animatedStyle = {
    transform: [{ translateX: position.x }, { rotate }],
  };

  // Undo last swipe
  const handleUndo = async () => {
    if (!lastSwipedProfile) return;
    try {
      const response = await undoPreviousSwipe();
      if (response && response.success) {
        position.setValue({ x: 0, y: 0 });
        setProfiles(prevProfiles => {
          const newProfiles = [lastSwipedProfile, ...prevProfiles];
          setNotificationCount(newProfiles.length);
          return newProfiles;
        });
        setLastSwipedProfile(null);
      }
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      {/* Card deck: show current card or animating card */}
      <View style={styles.deckContainer} {...panResponder.panHandlers}>
        {(isAnimating && animatingProfile) ? (
          <Animated.View
            key={animatingProfile.id}
            style={[dynamicStyles.card, animatedStyle]}
          >
            <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
              <Feather name="check" size={55} color="#4caf50" />
            </Animated.View>
            <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
              <Feather name="x" size={55} color="#f44336" />
            </Animated.View>
            <SwipeCard userType={userType === 'candidate' ? 'recruiter' : 'candidate'} {...animatingProfile} />
          </Animated.View>
        ) : profiles.length > 0 ? (
          <Animated.View
            key={profiles[0].id}
            style={[dynamicStyles.card, animatedStyle]}
          >
            <Animated.View style={[styles.likeLabel, { opacity: likeOpacity }]}>
              <Feather name="check" size={55} color="#4caf50" />
            </Animated.View>
            <Animated.View style={[styles.nopeLabel, { opacity: nopeOpacity }]}>
              <Feather name="x" size={55} color="#f44336" />
            </Animated.View>
            <SwipeCard userType={userType === 'candidate' ? 'recruiter' : 'candidate'} {...profiles[0]} />
          </Animated.View>
        ) : (
          // No more profiles to swipe
          <View style={styles.noMoreProfiles}>
            <Feather name="briefcase" size={80} color={Colors.light.textSecondary} />
            <Text style={styles.noMoreProfilesText}>Plus de profils pour le moment</Text>
          </View>
        )}
      </View>

      {/* Footer with swipe and undo buttons */}
      <View style={styles.footer}>
        <ActionButton icon="x" color={Colors.light.error} onPress={() => swipe('left')} />
        <ActionButton icon="refresh-cw" color="#4930a3" small onPress={handleUndo} style={{ marginTop: 15 }} />
        <ActionButton icon="check" color={Colors.light.accent} onPress={() => swipe('right')} />
      </View>
      {/* Bottom tab bar for navigation */}
      <BottomTabBar tabs={tabs} activeTabId="notifications" />
    </View>
  );
}

// Styles for the SwipeNotificationScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeLabel: {
    position: 'absolute',
    top: 40,
    left: 30,
    zIndex: 1000,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 5,
    borderColor: '#4caf50',
    borderRadius: 50,
    padding: 18,
    transform: [{ rotate: '15deg' }],
    shadowColor: '#4caf50',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  nopeLabel: {
    position: 'absolute',
    top: 40,
    right: 30,
    zIndex: 1000,
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderWidth: 5,
    borderColor: '#f44336',
    borderRadius: 50,
    padding: 18,
    transform: [{ rotate: '-15deg' }],
    shadowColor: '#f44336',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
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
    bottom: 105,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'transparent',
    gap: 15,
    zIndex: 100,
  },
  button: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    marginHorizontal: 10,
    elevation: 12,
  },
  smallButton: {
    width: 48,
    height: 48,
  },
  largeButton: {
    width: 60,
    height: 60,
  },
});
