import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import ActiveToggle from '../../../components/ui/ActiveToggle';
import CandidateCard from '../../../components/ui/CandidateCard';
import EditProfileButton from '../../../components/ui/EditProfileButton';
import BottomTabBar from '../../../components/ui/BottomTabBar';
import SmallMovaLogo from '../../../components/ui/SmallMovaLogo';
import { getCurrentUser } from '../../../services/api';
import { getCandidateTabs } from '@/constants/tabsConfig';

const { width, height } = Dimensions.get('window');

export default function CandidateProfileScreen() {
  const route = useRoute<RouteProp<AuthStackParamList, 'CandidateProfile'>>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // Redirection automatique à la première connexion
  useEffect(() => {
    if (route.params?.startEditing) {
      navigation.replace('EditProfileScreen', { userType: 'candidat' });
    }
  }, [route.params?.startEditing, navigation]);

  const [isActive, setIsActive] = useState(true);

  const [candidate, setCandidate] = useState({
    firstName: '',
    lastName: '',
    location: '',
    avatarUrl: '',
    job: '',
    experience: '',
    contractType: '',
    presentation: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setCandidate(prev => ({
          ...prev,
          firstName: user.firstName || prev.firstName,
          lastName: user.lastName || prev.lastName,
          location: user.location || prev.location,
          avatarUrl: user.avatarUrl || prev.avatarUrl,
          job: user.job || prev.job,
          experience: user.experience || prev.experience,
          contractType: user.contractType || prev.contractType,
          presentation: user.presentation || prev.presentation,
        }));
      } catch (error) {
        console.error('Erreur chargement profil:', error);
      }
    }
    fetchUser();
  }, []);

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
  };

  const tabs = getCandidateTabs(navigation, 0);

  return (
    <View style={{ flex: 1, backgroundColor: '#fffffffb' }}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoContainer, { paddingTop: height * 0.025, paddingBottom: height * 0.01 }]}>
          <SmallMovaLogo />
          <Text style={[styles.title, { fontSize: width * 0.08, marginTop: height * 0.035, color: '#6746a8' }]}>Mon Profil</Text>
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
            <EditProfileButton
              onPress={() => navigation.navigate('EditProfileScreen', { userType: 'candidat' })}
            />
          </View>
        </View>

        <CandidateCard
          avatarUrl={candidate.avatarUrl}
          firstName={candidate.firstName}
          lastName={candidate.lastName}
          location={candidate.location}
          job={candidate.job}
          experience={candidate.experience}
          contractType={candidate.contractType}
          presentation={candidate.presentation}
        />

        <View style={styles.container}>
          <View style={{ height: height * 0.08 }} />
        </View>
      </ScrollView>
      <BottomTabBar tabs={tabs} activeTabId="profile" />
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