import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, Button, useWindowDimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import ActiveToggle from '../../../components/ui/ActiveToggle';
import CandidateCard from '../../../components/ui/CandidateCard';
import EditProfileButton from '../../../components/ui/EditProfileButton';
import BottomTabBar from '../../../components/ui/BottomTabBar';
import SmallMovaLogo from '../../../components/ui/SmallMovaLogo';
import {getCurrentUser, updateProfile } from '../../../services/api';
import * as ImagePicker from 'expo-image-picker';

export default function CandidateProfileScreen() {
  const [isActive, setIsActive] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { width, height } = useWindowDimensions();

  // État d'édition
  const [isEditing, setIsEditing] = useState(false);

  // Données modifiables (au lieu de constante)
  const [candidate, setCandidate] = useState({
    firstName: 'Lucas',
    lastName: 'Boyadjian',
    location: 'Paris, France',
    avatarUrl: '',
    job: 'Développeur Front-end',
    experience: 'Débutant',
    contractType: 'CDI',
    presentation: "Débutant en développement front-end, mais talentueux et prêt à vous surprendre !",
  });

  // Ajoute ce useEffect pour charger les vraies données
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
    console.log(`Statut changé: ${value ? 'Activé' : 'Désactivé'}`);
  };

  // Basculer entre mode lecture/édition
  const handleEditProfile = () => {
    setIsEditing(!isEditing);
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    try {
      await updateProfile(candidate);
      setIsEditing(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Changer la photo
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

  const getTabsForCandidate = () => [
    {
      id: 'profile',
      iconName: 'card-outline',
      iconNameActive: 'card',
      label: 'Mon Profil',
      onPress: () => console.log('Déjà sur Mon Profil'),
    },
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

        {/* CandidateCard avec props d'édition */}
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

        {/* ✅ Boutons d'action en mode édition */}
        {isEditing && (
          <View style={[styles.buttonContainer, { paddingHorizontal: width * 0.06 }]}>
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button title="Enregistrer" onPress={handleSave} />
              </View>
              <View style={styles.buttonWrapper}>
                <Button title="Annuler" onPress={() => setIsEditing(false)} color="#999" />
              </View>
            </View>
          </View>
        )}

        <View style={styles.container}>
          <View style={{ height: height * 0.08 }} />
        </View>
      </ScrollView>
      <BottomTabBar tabs={getTabsForCandidate()} activeTabId="profile" />
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