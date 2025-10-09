import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Button, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import ActiveToggle from '../../../components/ui/ActiveToggle';
import RecruiterCard from '../../../components/ui/RecruiterCard';
import EditProfileButton from '../../../components/ui/EditProfileButton';
import BottomTabBar from '../../../components/ui/BottomTabBar';
import SmallMovaLogo from '../../../components/ui/SmallMovaLogo';
import * as ImagePicker from 'expo-image-picker';
import { getRecruiterTabs } from '@/constants/tabsConfig';

export default function RecruiterProfileScreen() {
  const route = useRoute<RouteProp<AuthStackParamList, 'RecruiterProfile'>>();
  const startEditing = route.params?.startEditing === true;

  const [isActive, setIsActive] = useState(true);
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { width, height } = useWindowDimensions();

  // Ajout état édition
  const [isEditing, setIsEditing] = useState(startEditing);
  const [firstEdit, setFirstEdit] = useState(startEditing);

  // Données modifiables
  const [recruiter, setRecruiter] = useState({
    companyName: 'TechCorp Solutions',
    location: 'Lyon, France',
    avatarUrl: '',
    jobSeeking: 'Développeur',
    experienceRequired: 'Intermédiaire',
    contractType: 'CDI',
    presentation: "Nous recherchons un développeur passionné pour rejoindre notre équipe dynamique et innovative !",
  });

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
  };

  // Empêche de quitter le mode édition à la première édition
  const handleEditProfile = () => {
    if (firstEdit) return;
    setIsEditing(!isEditing);
  };

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (
      !recruiter.companyName ||
      !recruiter.location ||
      !recruiter.jobSeeking ||
      !recruiter.experienceRequired ||
      !recruiter.contractType
    ) {
      alert('Tous les champs sont obligatoires sauf la présentation.');
      return;
    }
    // Ajoute ici ta logique d'API si besoin
    setIsEditing(false);
    setFirstEdit(false); // Permet d'afficher le bouton Annuler après la première édition
  };

  // Annuler édition
  const handleCancel = () => {
    setIsEditing(false);
    // Optionnel : remettre les anciennes valeurs si tu veux
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
      setRecruiter(prev => ({ ...prev, avatarUrl: result.assets[0].uri }));
    }
  };

  const notificationCount = 0; // À remplacer par ton vrai compteur
  const tabs = getRecruiterTabs(navigation, notificationCount);

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
                <EditProfileButton onPress={() => navigation.navigate('EditProfileScreen', { userType: 'recruteur' })} />
              </>
            )}
          </View>
        </View>

        {/* RecruiterCard avec props d'édition */}
        <RecruiterCard
          avatarUrl={recruiter.avatarUrl}
          companyName={recruiter.companyName}
          location={recruiter.location}
          jobSeeking={recruiter.jobSeeking}
          experienceRequired={recruiter.experienceRequired}
          contractType={recruiter.contractType}
          presentation={recruiter.presentation}
          isEditing={isEditing}
          onFieldChange={(field, value) => setRecruiter(prev => ({ ...prev, [field]: value }))}
          onImagePicker={handleImagePicker}
        />

        {/* Boutons d'action en mode édition */}
        {isEditing && (
          <View style={styles.buttonContainer}>
            <Button title="Enregistrer" onPress={handleSave} />
            {!firstEdit && <Button title="Annuler" onPress={handleCancel} color="#999" />}
          </View>
        )}

        <View style={styles.container}>
          <View style={{ height: height * 0.08 }} />
        </View>
      </ScrollView>
      {/* Masque la BottomTabBar lors de la première édition */}
      {!firstEdit && <BottomTabBar tabs={tabs} activeTabId="profile" />}
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