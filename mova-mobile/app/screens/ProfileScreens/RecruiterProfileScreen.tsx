import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import type { AuthStackParamList } from '../../../lib/types';
import BottomTabBar from '../../../components/ui/BottomTabBar';
import { getMyProfile } from '../../../services/api';
import { getRecruiterTabs } from '@/constants/tabsConfig';
import Colors from '../../../constants/Colors';
import ProfileSection from '../../../components/ui/ProfileSection'; // Correction de l'import

const { width } = Dimensions.get('window');

export default function RecruiterProfileScreen() {
  const route = useRoute<RouteProp<AuthStackParamList, 'RecruiterProfile'>>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const [profile, setProfile] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    location: '',
    avatarUrl: '',
    presentation: '',
  });
  const [jobOffer, setJobOffer] = useState({
    title: '',
    experience: '',
    contractType: '',
  });
  const [userId, setUserId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const fetchRecruiterData = async () => {
        try {
          const profileData = await getMyProfile();
          if (profileData && profileData.recruiterProfile) {
            const userProfile = profileData.recruiterProfile;

            // Get Company Name
            const companyName =
              userProfile.memberships && userProfile.memberships.length > 0
                ? userProfile.memberships[0].company.name
                : 'Entreprise non définie';

            // Parse searchDescription to get job title and presentation
            const searchDesc = userProfile.searchDescription || '';
            const parts = searchDesc.split('\n\n');
            let jobTitle = 'Non défini';
            if (parts.length > 1 && parts[0]) {
              jobTitle = parts[0];
            }

            setProfile(prev => ({
              ...prev,
              companyName: companyName,
              firstName: userProfile.firstName || '',
              lastName: userProfile.lastName || '',
              location: userProfile.locationWKT || 'Non définie',
              avatarUrl: prev.avatarUrl,
              presentation: searchDesc, // The full description is used for the presentation section
            }));

            setJobOffer({
              title: jobTitle,
              experience: userProfile.desiredExperienceLevel || 'Non défini',
              contractType: userProfile.desiredContractTypes ? userProfile.desiredContractTypes.join(', ') : 'Non défini',
            });

            setUserId(profileData.id);
          }
        } catch (error) {
          console.error("Erreur lors du chargement du profil recruteur:", error);
        }
      };
      fetchRecruiterData();
    }, [])
  );

  const notificationCount = 0; // Example count
  const tabs = getRecruiterTabs(navigation, notificationCount);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* --- Profile Header --- */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />
          <TouchableOpacity style={styles.editButton} onPress={() => {
            if (userId) {
              navigation.navigate('EditProfileScreen', { userType: 'recruiter', userId: userId, companyName: profile.companyName });
            }
          }}>
            <Feather name="edit-2" size={20} color="#4930a3" />
          </TouchableOpacity>
          <Text style={styles.name}>{profile.companyName}</Text>
          <Text style={styles.jobTitle}>{`${profile.firstName} ${profile.lastName}`.trim()}</Text>
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.location}>{profile.location}</Text>
          </View>
        </View>

        {/* --- Presentation Section --- */}
        <ProfileSection title="Présentation de l'entreprise" icon="user" iconColor="#4930a3">
          <Text style={styles.sectionText}>{profile.presentation}</Text>
        </ProfileSection>

        {/* --- Job Details Section --- */}
        <ProfileSection title="Recherche en cours" icon="briefcase" iconColor="#4930a3">
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Poste recherché:</Text>
            <Text style={styles.detailValue}>{jobOffer.title}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Expérience requise:</Text>
            <Text style={styles.detailValue}>{jobOffer.experience}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Type de contrat:</Text>
            <Text style={styles.detailValue}>{jobOffer.contractType}</Text>
          </View>
        </ProfileSection>

        {/* Spacer at the bottom */}
        <View style={{ height: 100 }} />
      </ScrollView>
      <BottomTabBar tabs={tabs} activeTabId="profile" />
    </View>
  );
}

// Using the same styles as CandidateProfileScreen for consistency
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
