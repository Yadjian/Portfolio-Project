import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActiveToggle from '../../components/ui/ActiveToggle';
import IdentityCard from '../../components/ui/IdentityCard';
import EditProfileButton from '../../components/ui/EditProfileButton';
import BottomTabBar from '../../components/ui/BottomTabBar';
import SmallMovaLogo from '../../components/ui/SmallMovaLogo';
import ColorBackground from '../../components/ui/ColorBackground';

export default function ProfileScreen() {
  const [isActive, setIsActive] = useState(true);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const userType = 'candidat';

  const user = {
    firstName: 'Lucas',
    lastName: 'Boyadjian',
    location: 'Paris, France',
    avatarUrl: '',
    job: 'Développeur Front-end',
    experience: 'Débutant',
    presentation: "Débutant en développement front-end, mais talentueux et prêt à vous surprendre !",
  };

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
    console.log(`Statut changé: ${value ? 'Activé' : 'Désactivé'}`);
  };

  const handleEditProfile = () => {
    console.log('Modifier le profil');
  };

  const getTabsForUserType = () => {
    const baseTabs = [
      {
        id: 'profile',
        iconName: 'card-outline',
        iconNameActive: 'card',
        label: 'Mon Profil',
        onPress: () => console.log('Déjà sur Mon Profil'),
      },
    ];

    if (userType === 'candidat') {
      return [
        ...baseTabs,
        {
          id: 'cv',
          iconName: 'document-text-outline',
          iconNameActive: 'document-text',
          label: 'Mon CV',
          onPress: () => console.log('Navigation vers Mon CV'),
        },
        {
          id: 'matches',
          iconName: 'heart-outline',
          iconNameActive: 'heart',
          label: 'Matchs',
          onPress: () => console.log('Navigation vers Mes matchs'),
        },
        {
          id: 'home',
          iconName: 'home-outline',
          iconNameActive: 'home',
          label: 'Home',
          onPress: () => navigation.goBack(),
        }
      ];
    } else {
      return [
        ...baseTabs,
        {
          id: 'offre',
          iconName: 'document-text-outline',
          iconNameActive: 'document-text',
          label: 'Mon Offre',
          onPress: () => console.log('Navigation vers Mon Offre Détaillée'),
        },
        {
          id: 'matches',
          iconName: 'people-outline',
          iconNameActive: 'people',
          label: 'Candidats',
          onPress: () => console.log('Navigation vers Candidats matchés'),
        },
        {
          id: 'home',
          iconName: 'home-outline',
          iconNameActive: 'home',
          label: 'Home',
          onPress: () => navigation.goBack(),
        }
      ];
    }
  };

  return (
    <ColorBackground>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoContainer, { paddingTop: height * 0.025, paddingBottom: height * 0.01 }]}>
          <SmallMovaLogo />
          <Text style={[styles.title, { fontSize: width * 0.08, marginTop: height * 0.035 }]}>ID CARD</Text>
        </View>

        <View style={{ height: height * 0.035 }} />

        <View style={[styles.container, { paddingHorizontal: width * 0.06 }]}>
          <View style={[styles.actionRow, { marginBottom: height * 0.01, paddingHorizontal: width * 0.01 }]}>
            <View style={styles.toggleWrapper}>
              <ActiveToggle 
                initialValue={isActive}
                onToggle={handleToggleActive}
              />
            </View>
            <EditProfileButton onPress={handleEditProfile} />
          </View>
        </View>

        <IdentityCard
          avatarUrl={user.avatarUrl}
          firstName={user.firstName}
          lastName={user.lastName}
          location={user.location}
          job={user.job}
          experience={user.experience}
          presentation={user.presentation}
        />

        <View style={styles.container}>
          <View style={{ height: height * 0.08 }} />
        </View>
      </ScrollView>
      <BottomTabBar tabs={getTabsForUserType()} activeTabId="profile" />
    </ColorBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleWrapper: {
    flex: 1,
  },
});