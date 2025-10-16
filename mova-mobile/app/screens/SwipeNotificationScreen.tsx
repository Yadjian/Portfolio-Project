import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, PanResponder } from 'react-native';
import CandidateCard from '@/components/ui/CandidateCard';
import RecruiterCard from '@/components/ui/RecruiterCard';
import BottomTabBar from '@/components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';
import SmallMovaLogo from '@/components/ui/SmallMovaLogo';
import { Ionicons } from '@expo/vector-icons';

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
  const [showGreenPop, setShowGreenPop] = useState(false);
  const [showRedPop, setShowRedPop] = useState(false);
  const greenPopAnim = useRef(new Animated.Value(0)).current;
  const redPopAnim = useRef(new Animated.Value(0)).current;
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 10,
      onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120 || gesture.dx < -120) {
          if (gesture.dx > 0) {
            // Swipe right: show green pop animation
            setShowGreenPop(true);
            greenPopAnim.setValue(0);
            Animated.sequence([
              Animated.timing(greenPopAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
              }),
              Animated.timing(greenPopAnim, {
                toValue: 0,
                duration: 320,
                useNativeDriver: true,
              })
            ]).start(() => {
              setShowGreenPop(false);
            });
          } else {
            // Swipe left: show red pop animation
            setShowRedPop(true);
            redPopAnim.setValue(0);
            Animated.sequence([
              Animated.timing(redPopAnim, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
              }),
              Animated.timing(redPopAnim, {
                toValue: 0,
                duration: 320,
                useNativeDriver: true,
              })
            ]).start(() => {
              setShowRedPop(false);
            });
          }
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

  // Fonctions pour simuler swipe à droite/gauche via bouton
  const handleSwipeRight = () => {
    if (currentIndex < contacts.length && cardVisible) {
      setShowGreenPop(true);
      greenPopAnim.setValue(0);
      Animated.timing(position.x, {
        toValue: width,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(greenPopAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(greenPopAnim, {
            toValue: 0,
            duration: 320,
            useNativeDriver: true,
          }).start(() => {
            setShowGreenPop(false);
            setCardVisible(false);
            setTimeout(() => {
              position.setValue({ x: 0, y: 0 });
              setCurrentIndex(i => i + 1);
              setCardVisible(true);
            }, 100);
          });
        });
      });
    }
  };
  const handleSwipeLeft = () => {
    if (currentIndex < contacts.length && cardVisible) {
      setShowRedPop(true);
      redPopAnim.setValue(0);
      Animated.timing(position.x, {
        toValue: -width,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(redPopAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(redPopAnim, {
            toValue: 0,
            duration: 320,
            useNativeDriver: true,
          }).start(() => {
            setShowRedPop(false);
            setCardVisible(false);
            setTimeout(() => {
              position.setValue({ x: 0, y: 0 });
              setCurrentIndex(i => i + 1);
              setCardVisible(true);
            }, 100);
          });
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 24 }}>
        {currentIndex < contacts.length && cardVisible && (
          <>
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
            {/* Green pop animation when swiping right */}
            {showGreenPop && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 20,
                  opacity: greenPopAnim,
                  // backgroundColor retiré
                }}
              >
                <Animated.View
                  style={{
                    transform: [
                      {
                        scale: greenPopAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1.6],
                        })
                      }
                    ]
                  }}
                >
                  <Ionicons name="checkmark-circle" size={120} color="#fff" />
                </Animated.View>
              </Animated.View>
            )}
            {/* Red pop animation when swiping left */}
            {showRedPop && (
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 20,
                  opacity: redPopAnim,
                  // backgroundColor retiré
                }}
              >
                <Animated.View
                  style={{
                    transform: [
                      {
                        scale: redPopAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1.6],
                        })
                      }
                    ]
                  }}
                >
                  <Ionicons name="close-circle" size={120} color="#fff" />
                </Animated.View>
              </Animated.View>
            )}
            {/* Boutons vert, rouge, jaune sur la même ligne sous la card */}
            <View style={{ marginTop: 64 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={[styles.iconCircleWithBorder, { borderColor: '#e74c3c' }]}> 
                  <Ionicons name="close" size={30} color="#e74c3c" onPress={handleSwipeLeft} />
                </View>
                <View style={[styles.iconCircleWithBorder, { borderColor: '#FFD600' }]}> 
                  <Ionicons name="refresh" size={30} color="#FFD600" style={{ transform: [{ scaleX: -1 }] }} />
                </View>
                <View style={[styles.iconCircleWithBorder, { borderColor: '#27ae60' }]}> 
                  <Ionicons name="checkmark" size={30} color="#27ae60" onPress={handleSwipeRight} />
                </View>
              </View>
            </View>
          </>
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
  iconCircle: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  iconCircleWithBorder: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    borderWidth: 2,
    // borderColor retiré pour laisser la couleur inline dominer
  },
});