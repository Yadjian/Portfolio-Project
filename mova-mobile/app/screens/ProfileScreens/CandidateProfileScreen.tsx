import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Button, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../lib/types';
import ActiveToggle from '../../../components/ui/ActiveToggle';
import CandidateCard from '../../../components/ui/CandidateCard';
import EditProfileButton from '../../../components/ui/EditProfileButton';
import BottomTabBar from '../../../components/ui/BottomTabBar';
import SmallMovaLogo from '../../../components/ui/SmallMovaLogo';
import { getCurrentUser, updateProfile } from '../../../services/api';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function CandidateProfileScreen() {
  const route = useRoute<RouteProp<AuthStackParamList, 'CandidateProfile'>>();
  const startEditing = route.params?.startEditing === true;

  const [isEditing, setIsEditing] = useState(startEditing);
  const [firstEdit, setFirstEdit] = useState(startEditing);
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

  // Empêche de quitter le mode édition à la première édition
  const handleEditProfile = () => {
    if (firstEdit) return;
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (
      !candidate.firstName ||
      !candidate.lastName ||
      !candidate.location ||
      !candidate.job ||
      !candidate.experience ||
      !candidate.contractType
    ) {
      alert('Tous les champs sont obligatoires sauf la présentation.');
      return;
    }
    try {
      await updateProfile(candidate);
      setIsEditing(false);
      setFirstEdit(false); // Après la première sauvegarde, édition normale
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCandidate(prev => ({ ...prev, avatarUrl: result.assets[0].uri }));
    }
  };

  const navigation = useNavigation();

  const getTabsForCandidate = () => [
    {
      id: 'profile',
      iconName: 'card-outline',
      iconNameActive: 'card',
      label: 'Mon Profil',
      onPress: () => {},
    },
    {
      id: 'cv',
      iconName: 'document-text-outline',
      iconNameActive: 'document-text',
      label: 'Mon CV',
      onPress: () => {},
    },
    {
      id: 'matches',
      iconName: 'heart-outline',
      iconNameActive: 'heart',
      label: 'Matchs',
      onPress: () => {},
    },
    {
      id: 'home',
      iconName: 'home-outline',
      iconNameActive: 'home',
      label: 'Home',
      onPress: () => navigation.goBack(),
    }
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#fffffffb' }}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoContainer, { paddingTop: height * 0.025, paddingBottom: height * 0.01 }]}>
          <SmallMovaLogo />
          <Text style={[styles.title, { fontSize: width * 0.08, marginTop: height * 0.035, color: '#6746a8' }]}>ID CARD</Text>
        </View>

        <View style={{ height: height * 0.055 }} />

        <View style={[styles.container, { paddingHorizontal: width * 0.06 }]}>
          <View style={[styles.actionRow, { marginBottom: height * 0.01, paddingHorizontal: width * 0.01 }]}>
            {/* Masque les boutons secondaires lors de la première édition */}
            {!firstEdit && (
              <>
                <View style={styles.toggleWrapper}>
                  <ActiveToggle 
                    initialValue={isActive}
                    onToggle={handleToggleActive}
                  />
                </View>
                <EditProfileButton onPress={handleEditProfile} />
              </>
            )}
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
          isEditing={isEditing}
          onFieldChange={(field, value) => setCandidate(prev => ({ ...prev, [field]: value }))}
          onImagePicker={handleImagePicker}
        />

        {isEditing && (
          <View style={styles.buttonContainer}>
            <Button title="Enregistrer" onPress={handleSave} />
            {!firstEdit && <Button title="Annuler" onPress={() => setIsEditing(false)} color="#999" />}
          </View>
        )}

        <View style={styles.container}>
          <View style={{ height: height * 0.08 }} />
        </View>
      </ScrollView>
      {/* Masque la BottomTabBar lors de la première édition */}
      {!firstEdit && <BottomTabBar tabs={getTabsForCandidate()} activeTabId="profile" />}
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
  buttonContainer: {
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});