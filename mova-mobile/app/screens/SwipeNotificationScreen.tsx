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

// Profils factices pour le test
const mockProfiles = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Dubois',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    job: 'Développeuse React Native',
    companyName: 'TechCorp',
    location: 'Paris, France',
    experience: '3 ans',
    presentation: 'Passionnée par le développement mobile et les nouvelles technologies.',
    contractType: 'CDI',
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Martin',
    avatarUrl: 'https://randomuser.me/api/portraits/men/56.jpg',
    job: 'Product Manager',
    companyName: 'Innovate Inc.',
    location: 'Lyon, France',
    experience: '5 ans',
    presentation: 'Expert en gestion de produit et stratégie digitale.',
    contractType: 'CDI',
  },
  {
    id: '3',
    firstName: 'Charlie',
    lastName: 'Rousseau',
    avatarUrl: 'https://randomuser.me/api/portraits/men/65.jpg',
    job: 'UX/UI Designer',
    companyName: 'Creative Solutions',
    location: 'Marseille, France',
    experience: '4 ans',
    presentation: 'Designer créatif avec un œil pour les détails.',
    contractType: 'Freelance',
  },
];

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

        // Si l'API renvoie des profils, on les utilise, sinon on utilise les profils factices
        if (data && data.length > 0) {
          // Mapper les données de l'API pour correspondre aux props de SwipeCard
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
          setProfiles(mappedProfiles);
        } else {
          console.log("Aucun profil reçu de l'API, utilisation des profils factices.");
          setProfiles(mockProfiles);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des profils à swiper, utilisation des profils factices:", error);
        setProfiles(mockProfiles); // Utiliser les profils factices en cas d'erreur
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
        duration: 400,
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

  const animatedStyle = {
    transform: [{ translateX: position.x }],
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
            <SwipeCard userType={userType === 'candidate' ? 'recruiter' : 'candidate'} {...animatingProfile} />
          </Animated.View>
        ) : profiles.length > 0 ? (
          <Animated.View
            key={profiles[0].id}
            style={[styles.card, animatedStyle]}
          >
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
        <ActionButton icon="refresh-cw" color={Colors.light.textSecondary} small onPress={handleUndo} style={{ marginTop: 15 }} />
        <ActionButton icon="check" color={Colors.light.accent} onPress={() => swipe('right')} />
      </View>
      <BottomTabBar tabs={tabs} activeTabId="notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: width * 0.95,
    top: 80,
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
    paddingBottom: 140,
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
