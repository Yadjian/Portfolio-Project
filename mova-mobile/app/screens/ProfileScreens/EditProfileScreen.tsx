import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, Image, Platform, TextInput, Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../lib/types';
import { updateProfile } from '../../../services/api';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MovaLogo from '../../../components/ui/MovaLogo';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'EditProfileScreen'>>();
  const { userType } = route.params;

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Champs pour candidat
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [job, setJob] = useState('');
  const [jobModalVisible, setJobModalVisible] = useState(false);
  const [experience, setExperience] = useState('');
  const [contractType, setContractType] = useState('');
  const [presentation, setPresentation] = useState('');
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);

  // Champs pour recruteur
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyAvatarUrl, setCompanyAvatarUrl] = useState('');
  const [jobSeeking, setJobSeeking] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');
  const [companyContractType, setCompanyContractType] = useState('');
  const [companyPresentation, setCompanyPresentation] = useState('');
  const [siret, setSiret] = useState('');

  // TODO: Pré-remplir les champs avec les données de l'utilisateur actuel

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);


  const handleSubmit = async () => {
    if (userType === 'candidate') {
      const candidateData = {
        firstName,
        lastName,
        location,
        avatarUrl,
        job,
        experience,
        contractType,
        presentation,
      };
      console.log('Updating candidate profile:', candidateData);
      // try {
      //   await updateProfile(candidateData);
      // } catch (error) {
      //   console.error("Erreur lors de l'enregistrement du profil candidat.", error);
      //   alert("Erreur lors de l'enregistrement du profil.");
      //   return;
      // }
      navigation.replace('CandidateProfile', { startEditing: false });
    } else {
      const recruiterData = {
        companyName,
        location,
        avatarUrl: companyAvatarUrl,
        jobSeeking,
        experienceRequired,
        contractType: companyContractType,
        presentation: companyPresentation,
        siret,
        // Les champs `firstName` et `lastName` sont aussi pour le recruteur (contact person)
        firstName,
        lastName,
      };
      console.log('Updating recruiter profile:', recruiterData);
      // try {
      //   await updateProfile(recruiterData);
      // } catch (error) {
      //   console.error("Erreur lors de l'enregistrement du profil recruteur.", error);
      //   alert("Erreur lors de l'enregistrement du profil.");
      //   return;
      // }
      navigation.replace('RecruiterProfile', { startEditing: false });
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <MovaLogo sizeProp={60} />
          <Text style={styles.title}>Complétez votre profil</Text>
          <Text style={styles.subtitle}>
            {userType === 'candidate' ? 'Candidat' : 'Recruteur'}
          </Text>
        </View>

        <View style={styles.formCard}>
          {userType === 'candidate' ? (
            <>
              {/* Image Picker */}
              <TouchableOpacity style={styles.imagePicker} onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [3, 4],
                  quality: 0.7,
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                  setAvatarUrl(result.assets[0].uri);
                }
              }}>
                <Image
                  source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/images/icon.png')}
                  style={styles.avatar}
                />
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={24} color="#fff" />
                </View>
              </TouchableOpacity>

              {/* Prénom */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Prénom</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Votre prénom" placeholderTextColor="#999" value={firstName} onChangeText={setFirstName} />
                </View>
              </View>

              {/* Nom */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Votre nom" placeholderTextColor="#999" value={lastName} onChangeText={setLastName} />
                </View>
              </View>

              {/* Localisation */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Localisation</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="location-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Ville, Pays" placeholderTextColor="#999" value={location} onChangeText={setLocation} />
                </View>
              </View>

              {/* Poste */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Poste recherché</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setJobModalVisible(true)}>
                  <Ionicons name="briefcase-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <Text style={[styles.input, !job && styles.placeholder]}>{job || 'Sélectionner un poste'}</Text>
                  <Ionicons name="chevron-down-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Expérience */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Expérience</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setExperienceModalVisible(true)}>
                  <Ionicons name="analytics-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <Text style={[styles.input, !experience && styles.placeholder]}>{experience || 'Sélectionner une expérience'}</Text>
                  <Ionicons name="chevron-down-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Contrat */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type de contrat</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setContractModalVisible(true)}>
                  <Ionicons name="document-text-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <Text style={[styles.input, !contractType && styles.placeholder]}>{contractType || 'Sélectionner un contrat'}</Text>
                  <Ionicons name="chevron-down-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              {/* Présentation */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Présentation</Text>
                <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start' }]}>
                  <Ionicons name="chatbox-ellipses-outline" size={20} color='#4930a3' style={[styles.inputIcon, { paddingTop: 15 }]} />
                  <TextInput style={[styles.input, { paddingTop: 15, textAlignVertical: 'top' }]} placeholder="Parlez-nous de vous..." placeholderTextColor="#999" value={presentation} onChangeText={setPresentation} multiline />
                </View>
              </View>
            </>
          ) : (
            <>
              {/* Recruiter Form */}
              <TouchableOpacity style={styles.imagePicker} onPress={async () => {
                const result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0.7,
                });
                if (!result.canceled && result.assets && result.assets.length > 0) {
                  setCompanyAvatarUrl(result.assets[0].uri);
                }
              }}>
                <Image
                  source={companyAvatarUrl ? { uri: companyAvatarUrl } : require('../../../assets/images/icon.png')}
                  style={styles.avatar}
                />
                <View style={styles.cameraIcon}>
                  <Ionicons name="camera" size={24} color="#fff" />
                </View>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Prénom du contact</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Votre prénom" placeholderTextColor="#999" value={firstName} onChangeText={setFirstName} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nom du contact</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Votre nom" placeholderTextColor="#999" value={lastName} onChangeText={setLastName} />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Localisation de l'entreprise</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="location-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Ville, Pays" placeholderTextColor="#999" value={location} onChangeText={setLocation} />
                </View>
              </View>

              {/* Other recruiter fields */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Poste recherché</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setJobModalVisible(true)}>
                  <Ionicons name="briefcase-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <Text style={[styles.input, !jobSeeking && styles.placeholder]}>{jobSeeking || 'Sélectionner un poste'}</Text>
                  <Ionicons name="chevron-down-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Expérience requise</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setExperienceModalVisible(true)}>
                  <Ionicons name="analytics-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <Text style={[styles.input, !experienceRequired && styles.placeholder]}>{experienceRequired || 'Sélectionner une expérience'}</Text>
                  <Ionicons name="chevron-down-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Type de contrat</Text>
                <TouchableOpacity style={styles.inputContainer} onPress={() => setContractModalVisible(true)}>
                  <Ionicons name="document-text-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                  <Text style={[styles.input, !companyContractType && styles.placeholder]}>{companyContractType || 'Sélectionner un contrat'}</Text>
                  <Ionicons name="chevron-down-outline" size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Présentation de l'entreprise</Text>
                <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start' }]}>
                  <Ionicons name="chatbox-ellipses-outline" size={20} color='#4930a3' style={[styles.inputIcon, { paddingTop: 15 }]} />
                  <TextInput style={[styles.input, { paddingTop: 15, textAlignVertical: 'top' }]} placeholder="Présentez votre entreprise..." placeholderTextColor="#999" value={companyPresentation} onChangeText={setCompanyPresentation} multiline />
                </View>
              </View>
            </>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enregistrer</Text>
          </TouchableOpacity>

          {/* Modals */}
          <Modal
            visible={jobModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setJobModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setJobModalVisible(false)}>
              <View style={styles.modalContent}>
                {[
                  'Serveur(se)',
                  'Vendeur(se) en boutique',
                  'Animateur(trice) de colonie',
                  'Cueilleur(se) de fruits',
                  'Plagiste'
                ].map(opt => (
                  <Pressable
                    key={opt}
                    style={styles.modalOption}
                    onPress={() => {
                      setJob(opt);
                      setJobModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        <View style={{ height: 40 }} /> 
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4930a3',
    marginTop: 16,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#4930a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    borderWidth: 3,
    borderColor: '#4930a3',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4930a3',
    borderRadius: 15,
    padding: 6,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  placeholder: {
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#4930a3',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10, // Reduced margin
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0006' },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 16, minWidth: 220 },
  modalOption: { paddingVertical: 12, alignItems: 'center' },
});