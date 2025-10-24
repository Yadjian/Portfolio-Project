import React, { useRef, useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity, Text, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import SwipeCard from '@/components/ui/SwipeCard';
import BottomTabBar from '@/components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';
import { UserType } from '@/lib/types';
import { getProfilesToSwipe, sendSwipeAction, undoPreviousSwipe } from '../../services/api';
import Colors from '@/constants/Colors';

const { width } = Dimensions.get('window');

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
  const userType: UserType = route?.params?.userType ?? 'candidate';

  const [profiles, setProfiles] = useState<any[]>([]);
  const [lastSwipedProfile, setLastSwipedProfile] = useState<any | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingProfile, setAnimatingProfile] = useState<any | null>(null);
  const position = useRef(new Animated.ValueXY()).current;
  const panResponderRef = useRef<any>(null);

  useEffect(() => {
    const getLocationAndFetchProfiles = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        // You can show an alert here to the user
        return;
      }

      try {
        console.log('Fetching profiles for userType:', userType);
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        console.log('Sending Location:', { latitude, longitude });

        const data = await getProfilesToSwipe(userType, latitude, longitude);
        console.log('API Response Data:', data);

        // PROFIL TEMPORAIRE EN DUR POUR TESTER LE DESIGN
        const mockRecruiter = {
          id: 'mock-1',
          firstName: 'Sophie',
          lastName: 'Martin',
          avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          locationName: 'Paris, France',
          searchDescription: 'Serveur / Serveuse\n\nRestaurant Le Gourmet recherche serveurs dynamiques pour sa terrasse avec vue sur la Seine. Rejoignez notre équipe dans un cadre d\'exception. Expérience souhaitée, formation assurée. Nous offrons un environnement stimulant au cœur de Paris.',
          companyName: 'Le Gourmet Paris',
          desiredExperienceLevel: 'INTERMEDIAIRE',
          desiredContractTypes: ['CDI'],
        };

        // Mapper le profil mock
        const mappedMockProfile = {
          ...mockRecruiter,
          location: mockRecruiter.locationName,
          jobSeeking: 'Serveur / Serveuse',
          experienceRequired: mockRecruiter.desiredExperienceLevel,
          presentation: 'Restaurant Le Gourmet recherche serveurs dynamiques pour sa terrasse avec vue sur la Seine. Rejoignez notre équipe dans un cadre d\'exception. Expérience souhaitée, formation assurée. Nous offrons un environnement stimulant au cœur de Paris.',
          contractType: mockRecruiter.desiredContractTypes.join(', '),
        };

        // Ajouter le profil mock aux données
        const allProfiles = [mappedMockProfile];

        // Mapper les données de l'API pour correspondre aux props de SwipeCard
        if (data && data.length > 0) {
          const mappedProfiles = data.map((profile: any) => {
            if (userType === 'candidate') {
              // Le candidat voit des recruteurs
              // Extraire le titre et la description depuis searchDescription
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
              // Le recruteur voit des candidats
              // Extraire le poste depuis desiredJobTitle et la présentation depuis coverLetterText
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
        
        // PROFIL TEMPORAIRE POUR TEST (à retirer après)
        if (userType === 'candidate' && allProfiles.length === 0) {
          const tempProfile = {
            id: 'temp-recruiter-1',
            firstName: 'Marie',
            lastName: 'Dupont',
            avatarUrl: 'https://randomuser.me/api/portraits/women/32.jpg',
            location: 'Cannes, France',
            jobSeeking: 'Serveur / Serveuse',
            experienceRequired: 'INTERMEDIAIRE',
            presentation: 'Le Restaurant Le Gourmet recherche un serveur dynamique ! Rejoignez notre équipe dans un cadre prestigieux. Expérience souhaitée, excellente présentation et sens du service requis.',
            companyName: 'Restaurant Le Gourmet',
            contractType: 'CDI',
          } as any; // Bypass TypeScript pour le profil temporaire
          allProfiles.push(tempProfile);
        }
        
        setProfiles(allProfiles.length > 0 ? allProfiles : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des profils à swiper:", error);
        setProfiles([]); // Tableau vide en cas d'erreur
      }
    };

    getLocationAndFetchProfiles();
  }, []);

  const baseTabs = userType === 'recruiter' ? getRecruiterTabs(navigation, 0) : getCandidateTabs(navigation, 0);
  const tabs = baseTabs.map(tab =>
    tab.id === 'notifications'
      ? { ...tab, onPress: () => {} } // Disable click on active tab
      : tab
  );

  const resetPosition = useCallback(() => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
      friction: 5,
    }).start();
  }, [position]);

  const swipe = useCallback((direction: 'right' | 'left') => {
    setIsAnimating(prev => {
      if (prev) return prev; // Already animating
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

      // Fire-and-forget API call
      sendSwipeAction(currentProfile.id, action)
        .then(response => {
          if (response && response.isMatch) {
            Alert.alert("C'est un Match !", "Vous pouvez maintenant discuter avec cette personne.");
          }
        })
        .catch(error => {
          console.error("Erreur lors de l'envoi de l'action de swipe:", error);
        });

      // Start animation immediately
      Animated.timing(position, {
        toValue: { x: direction === 'right' ? width * 1.5 : -width * 1.5, y: 0 },
        duration: 600,
        useNativeDriver: false,
      }).start(() => {
        // Update state only after animation is complete
        setLastSwipedProfile(currentProfile);
        setProfiles(prevProfiles => prevProfiles.slice(1));
        position.setValue({ x: 0, y: 0 });
        setIsAnimating(false);
        setAnimatingProfile(null);
      });

      return currentProfiles; // Don't change profiles yet, wait for animation
    });
  }, [position]);

  // Initialize panResponder once, but it will always use the latest swipe/resetPosition
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

  const handleUndo = async () => {
    if (!lastSwipedProfile) return;

    try {
      const response = await undoPreviousSwipe();
      if (response && response.success) {
        position.setValue({ x: 0, y: 0 });
        setProfiles(prevProfiles => [lastSwipedProfile, ...prevProfiles]);
        setLastSwipedProfile(null);
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation du swipe:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer} {...panResponder.panHandlers}>
        {/* Show animating card OR current card */}
        {(isAnimating && animatingProfile) ? (
          <Animated.View
            key={animatingProfile.id}
            style={[styles.card, animatedStyle]}
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
            style={[styles.card, animatedStyle]}
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
          <View style={styles.noMoreProfiles}>
            <Feather name="briefcase" size={80} color={Colors.light.textSecondary} />
            <Text style={styles.noMoreProfilesText}>Plus de profils pour le moment</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <ActionButton icon="x" color={Colors.light.error} onPress={() => swipe('left')} />
        <ActionButton icon="refresh-cw" color="#4930a3" small onPress={handleUndo} style={{ marginTop: 15 }} />
        <ActionButton icon="check" color={Colors.light.accent} onPress={() => swipe('right')} />
      </View>
      <BottomTabBar tabs={tabs} activeTabId="notifications" />
    </View>
  );
}

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
