import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import CandidateCard from '@/components/ui/CandidateCard';
import RecruiterCard from '@/components/ui/RecruiterCard';
import BottomTabBar from '@/components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';
import SmallMovaLogo from '@/components/ui/SmallMovaLogo';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.95;
const CARD_HEIGHT = Math.min(600, width * 1.2); // ou adapte selon ton besoin

export default function SwipeNotificationScreen({ route }: any) {
  const userType = route?.params?.userType ?? 'candidat';

  const contacts: any[] = userType === 'candidat'
    ? [
        {
          id: '1',
          companyName: 'Test Entreprise',
          location: 'Paris',
          jobSeeking: 'Développeur',
          experienceRequired: 'Junior',
          contractType: 'CDI',
          presentation: `Je suis passionné par le recrutement et l'accompagnement des talents. Mon expérience m'a permis de collaborer avec des entreprises variées.
          J'aime créer des opportunités et des rencontres professionnelles. Je suis passionné par le recrutement et l'accompagnement des talents.
          Mon expérience m'a permis de collaborer avec des entreprises variées. J'aime créer des opportunités et des rencontres professionnelles.`,
          avatarUrl: ''
        },
        {
          id: '2',
          companyName: 'Autre Entreprise',
          location: 'Lyon',
          jobSeeking: 'Designer',
          experienceRequired: 'Senior',
          contractType: 'CDD',
          presentation: 'Autre présentation',
          avatarUrl: ''
        },
      ]
    : [
        { id: '1', firstName: 'Lucas', lastName: 'Boyadjian', location: 'Paris', job: 'Développeur', experience: 'Débutant', contractType: 'CDI', presentation: 'Présentation Lucas', avatarUrl: '' },
        { id: '2', firstName: 'Marie', lastName: 'Dupont', location: 'Lille', job: 'Product Owner', experience: 'Confirmé', contractType: 'CDI', presentation: 'Présentation Marie', avatarUrl: '' },
      ];

  const tabs = userType === 'candidat'
    ? getCandidateTabs(undefined, 0)
    : getRecruiterTabs(undefined, 0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 10,
      onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120 || gesture.dx < -120) {
          Animated.timing(position, {
            toValue: { x: gesture.dx > 0 ? width : -width, y: 0 },
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            setCardVisible(false);
            setTimeout(() => {
              position.setValue({ x: 0, y: 0 });
              setCurrentIndex(i => i + 1); // <-- On passe au profil suivant
              setCardVisible(true);
            }, 100);
          });
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const currentCard = contacts[currentIndex];

  const rotate = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  const animatedStyle = {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    transform: [
      { translateX: position.x },
      { rotate },
      { scale: position.x.interpolate({
          inputRange: [-width, 0, width],
          outputRange: [0.95, 1, 0.95],
        })
    },
  ],
    opacity: position.x.interpolate({
      inputRange: [-width, 0, width],
      outputRange: [0.5, 1, 0.5],
    }),
    // On retire le fond et le borderRadius pour éviter la superposition
    elevation: 0,
    shadowColor: 'transparent',
    backgroundColor: 'transparent',
    borderRadius: 0,
  };

  return (
    <View style={styles.container}>
      {/* Supprimé : logo et titre */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {currentIndex < contacts.length && cardVisible && (
          <Animated.View
            style={animatedStyle}
            {...panResponder.panHandlers}
          >
            {userType === 'candidat' ? (
              <RecruiterCard {...contacts[currentIndex]} />
            ) : (
              <CandidateCard {...contacts[currentIndex]} />
            )}
          </Animated.View>
        )}
        {currentIndex >= contacts.length && (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>Plus de profils à afficher</Text>
        )}
      </View>
      <BottomTabBar tabs={tabs} activeTabId="notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  logoRow: {
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6746a8',
    textAlign: 'center',
    marginBottom: 40,
  },
  card: {
    width: '100%',
    height: '100%',
  },
});