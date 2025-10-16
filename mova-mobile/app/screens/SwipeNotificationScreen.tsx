import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, PanResponder, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SwipeCard from '@/components/ui/SwipeCard';
import BottomTabBar from '@/components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';

const { width, height } = Dimensions.get('window');

const ActionButton = ({ onPress, small, color, icon, style }: any) => (
  <TouchableOpacity onPress={onPress} style={[styles.button, small ? styles.smallButton : styles.largeButton, { backgroundColor: '#fff', shadowColor: color }, style]}>
    <Ionicons name={icon} size={small ? 20 : 28} color={color} />
  </TouchableOpacity>
);

export default function SwipeNotificationScreen({ route, navigation }: any) {
  const userType = route?.params?.userType ?? 'candidat';

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

  const tabs = (userType === 'candidat'
    ? getCandidateTabs(navigation, 0)
    : getRecruiterTabs(navigation, 0)
  ).map(tab => {
    if (tab.id === 'notifications') {
      return { ...tab, onPress: () => {} };
    }
    return tab;
  });

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
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const swipe = (direction: 'right' | 'left') => {
    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width * 1.5 : -width * 1.5, y: 0 },
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setProfiles(prevProfiles => prevProfiles.slice(1));
      position.setValue({ x: 0, y: 0 });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.deckContainer}>
        {profiles.map((profile, index) => {
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
            <Animated.View key={profile.id} style={styles.card}>
              <SwipeCard userType={userType === 'candidat' ? 'recruiter' : 'candidate'} {...profile} />
            </Animated.View>
          );
        }).reverse()}
      </View>

      <View style={styles.footer}>
        <ActionButton icon="close" color="#fd297b" onPress={() => swipe('left')} />
        <ActionButton icon="refresh" color="#f6d365" small style={{ transform: [{scaleX: -1}] }} />
        <ActionButton icon="checkmark" color="#20e3b2" onPress={() => swipe('right')} />
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
    width: width * 0.95,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 90, // Space for the BottomTabBar
  },
  button: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  smallButton: {
    width: 40,
    height: 40,
  },
  largeButton: {
    width: 55,
    height: 55,
  },
});
