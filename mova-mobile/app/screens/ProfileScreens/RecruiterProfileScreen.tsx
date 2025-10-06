import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActiveToggle from '../../../components/ui/ActiveToggle';
import RecruiterCard from '../../../components/ui/RecruiterCard';
import EditProfileButton from '../../../components/ui/EditProfileButton';
import BottomTabBar from '../../../components/ui/BottomTabBar';
import SmallMovaLogo from '../../../components/ui/SmallMovaLogo';

export default function RecruiterProfileScreen() {
  const [isActive, setIsActive] = useState(true);
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();

  const userType = 'recruteur';

  const recruiter = {
    companyName: 'TechCorp Solutions',
    location: 'Lyon, France',
    avatarUrl: '',
    jobSeeking: 'Développeur',
    experienceRequired: 'Intermédiaire',
    contractType: 'CDI',
    presentation: "Nous recherchons un développeur passionné pour rejoindre notre équipe dynamique et innovative !",
  };

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
    console.log(`Statut changé: ${value ? 'Activé' : 'Désactivé'}`);
  };

  const handleEditProfile = () => {
    console.log('Modifier le profil recruteur');
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
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fffffffb' }}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoContainer, { paddingTop: height * 0.025, paddingBottom: height * 0.01, }]}>
          <SmallMovaLogo />
          <Text style={[styles.title, { fontSize: width * 0.08, marginTop: height * 0.035, color: '#6746a8' }]}>ID CARD</Text>
        </View>

        <View style={{ height: height * 0.055 }} />

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

        <RecruiterCard
          avatarUrl={recruiter.avatarUrl}
          companyName={recruiter.companyName}
          location={recruiter.location}
          jobSeeking={recruiter.jobSeeking}
          experienceRequired={recruiter.experienceRequired}
          contractType={recruiter.contractType}
          presentation={recruiter.presentation}
        />

        <View style={styles.container}>
          <View style={{ height: height * 0.08 }} />
        </View>
      </ScrollView>
      <BottomTabBar tabs={getTabsForUserType()} activeTabId="profile" />
    </View>
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