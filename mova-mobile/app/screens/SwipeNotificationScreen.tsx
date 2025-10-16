import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity, Text } from 'react-native';
import { Feather } from '@expo/vector-icons'; // Changed from Ionicons
import SwipeCard from '@/components/ui/SwipeCard';
import BottomTabBar from '@/components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';
import Colors from '@/constants/Colors'; // Import our new colors

const { width } = Dimensions.get('window');

// Re-styled ActionButton
const ActionButton = ({ onPress, small, color, icon, style }: { 
  onPress: () => void;
  small?: boolean;
  color: string;
  icon: keyof typeof Feather.glyphMap;
  style?: any;
}) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, small ? styles.smallButton : styles.largeButton, { backgroundColor: Colors.light.backgroundCard, shadowColor: '#000' }, style]}>
    <Feather name={icon} size={small ? 24 : 32} color={color} />
  </TouchableOpacity>
);

export default function SwipeNotificationScreen({ route, navigation }: any) {
  const userType = route?.params?.userType ?? 'candidat';

  // --- Mock data remains the same ---
  const contacts: any[] = userType === 'candidat'
    ? [
        {
          id: '1',
          companyName: 'Stark Industries',
          location: 'New York',
          jobSeeking: 'Développeur React Native',
          experienceRequired: 'Confirmé',
          contractType: 'CDI',
          avatarUrl: 'https://img.phonandroid.com/2023/04/iron-man-avengers-endgame.jpg',
          presentation: 'Génie, milliardaire, playboy, philanthrope. Cherche des talents exceptionnels pour changer le monde. Nous offrons un environnement de travail stimulant, des projets innovants et une armure de haute technologie (en option). Le candidat idéal maîtrisera l\'arc-réacteur et aura une bonne connaissance des protocoles de vol. Le travail d\'équipe est essentiel, car vous collaborerez étroitement avec les autres Avengers. Rejoignez-nous pour construire le futur, aujourd\'hui.',
        },
        {
          id: '2',
          companyName: 'Wayne Enterprises',
          location: 'Gotham City',
          jobSeeking: 'Chef de Projet Mobile',
          experienceRequired: 'Intermédiaire',
          contractType: 'CDD',
          avatarUrl: 'https://www.presse-citron.net/app/uploads/2022/03/batman-robert-pattinson.jpg',
          presentation: 'Nous construisons un avenir meilleur. Et parfois, nous travaillons la nuit.',
        },
      ]
    : [
        {
          id: '3',
          firstName: 'Peter',
          lastName: 'Parker',
          location: 'New York',
          job: 'Développeur Full-Stack',
          experience: 'Débutant',
          contractType: 'Alternance',
          avatarUrl: 'https://static.posters.cz/image/1300/affiches/spider-man-no-way-home-i121225.jpg',
          presentation: 'Photographe le jour, super-héros la nuit. Grande agilité avec les frameworks JavaScript.',
        },
        {
          id: '4',
          firstName: 'Diana',
          lastName: 'Prince',
          location: 'Themyscira',
          job: 'Product Owner',
          experience: 'Confirmé',
          contractType: 'CDI',
          avatarUrl: 'https://www.ecranlarge.com/media/cache/1600x1200/uploads/image/001/498/wonder-woman-1984-photo-1498168.jpg',
          presentation: 'Passionnée par la justice, la paix et les sprints bien menés. Expérience millénaire.',
        },
      ];

  const [profiles, setProfiles] = useState(contacts);
  const position = useRef(new Animated.ValueXY()).current;

  // --- All the logic (tabs, panResponder, animations) remains the same ---
  const baseTabs = userType === 'recruteur' ? getRecruiterTabs(navigation, 0) : getCandidateTabs(navigation, 0);
  const tabs = baseTabs.map(tab => 
    tab.id === 'notifications' 
      ? { ...tab, onPress: () => {} } // Désactive le clic sur l'onglet actif
      : tab
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
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
    transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
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
                  <SwipeCard userType={userType === 'candidat' ? 'recruiter' : 'candidate'} {...profile} />
                </Animated.View>
              );
            }
            return (
              <Animated.View key={profile.id} style={[styles.card, styles.behindCard]}>
                <SwipeCard userType={userType === 'candidat' ? 'recruiter' : 'candidate'} {...profile} />
              </Animated.View>
            );
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
        <ActionButton icon="refresh-cw" color={Colors.light.textSecondary} small onPress={() => { /* TODO: Implement refresh logic */ }} />
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
    width: width * 0.9, // Slightly smaller width
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 15,
    paddingBottom: 100, // Space for the BottomTabBar
  },
  button: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  smallButton: {
    width: 50,
    height: 50,
  },
  largeButton: {
    width: 65,
    height: 65,
  },
});