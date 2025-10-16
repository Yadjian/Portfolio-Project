import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import type { AuthStackParamList } from '../../../lib/types';
import BottomTabBar from '../../../components/ui/BottomTabBar';
import { getCurrentUser } from '../../../services/api';
import { getCandidateTabs } from '@/constants/tabsConfig';
import Colors from '../../../constants/Colors';
import ProfileSection from '../../../components/ui/ProfileSection';

const { width } = Dimensions.get('window');

export default function CandidateProfileScreen() {
  const route = useRoute<RouteProp<AuthStackParamList, 'CandidateProfile'>>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  // This useEffect to navigate to EditProfileScreen remains the same
  useEffect(() => {
    if (route.params?.startEditing) {
      navigation.replace('EditProfileScreen', { userType: 'candidate' });
    }
  }, [route.params?.startEditing, navigation]);

  const [candidate, setCandidate] = useState({
    firstName: '',
    lastName: '',
    location: '',
    avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg', // Placeholder
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

  const tabs = getCandidateTabs(navigation, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* --- Profile Header --- */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <Image source={{ uri: candidate.avatarUrl }} style={styles.avatar} />
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfileScreen', { userType: 'candidate' })}>
            <Feather name="edit-2" size={20} color="#4930a3" />
          </TouchableOpacity>
          <Text style={styles.name}>{`${candidate.firstName} ${candidate.lastName}`.trim()}</Text>
          <Text style={styles.jobTitle}>{candidate.job}</Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color="#4930a3" />
            <Text style={styles.location}>{candidate.location}</Text>
          </View>
        </View>

        {/* --- About Section --- */}
        <ProfileSection title="Présentation" icon="user" iconColor="#4930a3">
          <Text style={styles.sectionText}>{candidate.presentation || 'Aucune présentation pour le moment.'}</Text>
        </ProfileSection>

        {/* --- Details Section --- */}
        <ProfileSection title="Détails" icon="briefcase" iconColor="#4930a3">
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Poste recherché:</Text>
            <Text style={styles.detailValue}>{candidate.job}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Expérience:</Text>
            <Text style={styles.detailValue}>{candidate.experience}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type de contrat:</Text>
            <Text style={styles.detailValue}>{candidate.contractType}</Text>
          </View>
        </ProfileSection>

        {/* Spacer at the bottom */}
        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomTabBar tabs={tabs} activeTabId="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    flex: 1,
  },
  // Header Styles
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: Colors.light.backgroundCard,
  },
  headerBackground: {
    backgroundColor: '#4930a3',
    height: 100,
    width: '100%',
    position: 'absolute',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: Colors.light.backgroundCard,
    marginTop: 30, // Ajusté pour centrer l'avatar plus grand
  },
  editButton: {
    position: 'absolute',
    top: 120, // Ajusté pour le nouvel avatar
    right: 20,
    backgroundColor: Colors.light.backgroundCard,
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 10,
  },
  jobTitle: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginLeft: 4,
  },
  sectionText: {
    fontSize: 15,
    color: Colors.light.text,
    lineHeight: 22,
  },
  // Detail Section Styles
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: Colors.light.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    color: Colors.light.text,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
});