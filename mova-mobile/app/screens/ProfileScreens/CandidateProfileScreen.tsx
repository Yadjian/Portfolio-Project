import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import type { AuthStackParamList } from '../../../lib/types';
import BottomTabBar from '../../../components/ui/BottomTabBar';
import { getMyProfile } from '../../../services/api';
import { getCandidateTabs } from '@/constants/tabsConfig';
import { useNotifications } from '@/contexts/NotificationContext';
import Colors from '../../../constants/Colors';
import ProfileSection from '../../../components/ui/ProfileSection';

/**
 * CandidateProfileScreen
 *
 * This screen displays the candidate's profile information.
 *
 * Main features:
 * - Fetches candidate data from the backend when the screen is focused.
 * - Shows the candidate's avatar, name, location, and edit button.
 * - Displays job search details (desired job, experience, contract type).
 * - Shows a presentation/cover letter section.
 * - Allows navigation to the profile edit screen.
 * - Displays a bottom tab bar for candidate navigation.
 *
 * Key logic:
 * - Uses useFocusEffect to refresh candidate data on focus.
 * - Maps backend profile data to UI state.
 * - Handles navigation and UI state for editing.
 */

export default function CandidateProfileScreen() {
  // Get navigation and route objects
  const route = useRoute<RouteProp<AuthStackParamList, 'CandidateProfile'>>();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { width } = useWindowDimensions();
  
  // Get notification badges from context
  const { matchBadgeCount, profileBadgeCount, refreshMatchBadge } = useNotifications();

  // State for candidate profile data
  const [candidate, setCandidate] = useState({
    firstName: '',
    lastName: '',
    locationName: '',
    avatarUrl: '',
    job: '',
    experience: '',
    contractType: '',
    presentation: '',
  });
  // State for user ID
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch candidate profile data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
      try {
          const profileData = await getMyProfile();
          if (profileData && profileData.candidateProfile) {
            const userProfile = profileData.candidateProfile;
            setCandidate(prev => ({
              ...prev,
              firstName: userProfile.firstName || '',
              lastName: userProfile.lastName || '',
              locationName: userProfile.locationName || 'Non définie',
              avatarUrl: userProfile.photoUrl || '',
              job: userProfile.desiredJobTitle || '',
              experience: userProfile.experienceLevel || '',
              contractType: userProfile.desiredContractTypes ? userProfile.desiredContractTypes.join(', ') : '',
              presentation: userProfile.coverLetterText || '',
            }));
            setUserId(profileData.id);
          }
          await refreshMatchBadge();
      } catch (error) {
      }
      };
      fetchUser();
    }, [refreshMatchBadge])
  );

  // Get the tab configuration for the candidate with badge counts
  const tabs = getCandidateTabs(navigation, profileBadgeCount).map(tab => {
    if (tab.id === 'matches') {
      return { ...tab, badge: matchBadgeCount };
    }
    return tab;
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* --- Profile Header --- */}
        {/* Displays avatar, name, location, and edit button */}
        <View style={styles.header}>
          <View style={styles.headerBackground} />
          <Image source={candidate.avatarUrl ? { uri: candidate.avatarUrl } : require('../../../assets/images/icon.png')} style={styles.avatar} />
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => {
              if (userId) navigation.navigate('EditProfileScreen', { userType: 'candidate', userId: userId });
            }}>
            <Feather name="edit-2" size={20} color="#4930a3" />
          </TouchableOpacity>
          
          <Text style={styles.name}>{`${candidate.firstName} ${candidate.lastName}`.trim()}</Text>

          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.location}>{candidate.locationName}</Text>
          </View>
        </View>

        {/* --- Search Section --- */}
        {/* Displays job search details: desired job, experience, contract type */}
        <ProfileSection title="Recherche" icon="briefcase" iconColor="#4930a3">
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

        {/* --- About Section --- */}
        {/* Displays candidate's presentation/cover letter */}
        <ProfileSection title="Présentation" icon="user" iconColor="#4930a3">
          <Text style={styles.sectionText}>{candidate.presentation || 'Aucune présentation pour le moment.'}</Text>
        </ProfileSection>

        {/* Spacer at the bottom for layout */}
        <View style={{ height: 140 }} />
      </ScrollView>
      {/* Bottom tab bar navigation */}
      <BottomTabBar tabs={tabs} activeTabId="profile" />
    </View>
  );
}

// Styles for the candidate profile screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundCard,
  },
  scrollContainer: {
    flex: 1,
  },
  // Header Styles
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: Colors.light.backgroundCard,
    marginHorizontal: 8,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
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
    marginTop: 30,
  },
  editButton: {
    position: 'absolute',
    top: 120,
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
    color: Colors.light.text,
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