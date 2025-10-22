import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, Image, Platform, TextInput, Keyboard, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../../lib/types';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MovaLogo from '../../../components/ui/MovaLogo';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { getMyProfile, updateProfile, getContractTypes, getExperienceLevels, getJobCategories } from '../../../services/api';
import { GooglePlaceDetail } from 'react-native-google-places-autocomplete'; // Importation explicite du type
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import { useAuth } from '../../../contexts/AuthContext';

export default function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'EditProfileScreen'>>();
  const { userType, userId, companyName: companyNameFromNav } = route.params;
  const { refreshUser } = useAuth();

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Définition de la clé API à l'intérieur du composant
  const GOOGLE_PLACES_API_KEY = Platform.select({
    android: Constants.expoConfig?.extra?.googlePlacesApiKeyAndroid,
    ios: Constants.expoConfig?.extra?.googlePlacesApiKeyIos,
  });

  // Ajout d'un log pour vérifier la valeur de la clé API au moment du rendu
  console.log("DEBUG: GOOGLE_PLACES_API_KEY in EditProfileScreen:", GOOGLE_PLACES_API_KEY);

  // Champs pour candidat
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationWKT, setLocationWKT] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [job, setJob] = useState('');
  const [selectedJobCategoryId, setSelectedJobCategoryId] = useState<string | null>(null);
  const [jobModalVisible, setJobModalVisible] = useState(false);
  const [experience, setExperience] = useState('');
  const [contractType, setContractType] = useState('');
  const [presentation, setPresentation] = useState('');

  // Champ pour recruteur
  const [companyName, setCompanyName] = useState(companyNameFromNav || '');

  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  // State for dropdowns
  const [contractTypes, setContractTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [jobCategories, setJobCategories] = useState<{ id: string; name: string }[]>([]);

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

  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const [contracts, experiences, categories] = await Promise.all([
          getContractTypes(),
          getExperienceLevels(),
          getJobCategories(),
        ]);
        setContractTypes(contracts);
        setExperienceLevels(experiences);
        // Trier les catégories par ordre alphabétique
        const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
        setJobCategories(sortedCategories);
      } catch (error) {
        console.error("Erreur lors de la récupération des métadonnées:", error);
      }
    };

    fetchMetaData();
  }, []);

  // Pré-remplir les champs avec les données de l'utilisateur actuel
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      setIsLoading(true);

      try {
        const data = await getMyProfile();

        if (!data) {
          console.log("Profil non trouvé.");
          return;
        }

        const profile = userType === 'candidate' ? data.candidateProfile : data.recruiterProfile;

        if (profile) {
          setFirstName(profile.firstName || '');
          setLastName(profile.lastName || '');
          setAvatarUrl(profile.photoUrl || '');
          setLocationName(profile.locationName || '');
          setLocationWKT(profile.locationWKT || '');
          
          if (userType === 'candidate') {
            setJob(profile.desiredJobTitle || '');
            setExperience(profile.experienceLevel || '');
            setPresentation(profile.coverLetterText || '');
            if (profile.desiredContractTypes && profile.desiredContractTypes.length > 0) {
              setContractType(profile.desiredContractTypes[0]);
            }
          } else { // Recruiter
            setExperience(profile.desiredExperienceLevel || '');
            if (profile.desiredContractTypes && profile.desiredContractTypes.length > 0) {
              setContractType(profile.desiredContractTypes.join(', '));
            }
            const searchDesc = profile.searchDescription || '';
            const parts = searchDesc.split('\n\n');
            if (parts.length > 1) {
              setJob(parts[0]);
              setPresentation(parts.slice(1).join('\n\n'));
            } else {
              setPresentation(searchDesc);
            }
          }
        } else {
            console.log(`Profil de type ${userType} non trouvé.`);
        }

      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, userType]);


  const handleSubmit = async () => {
    setIsLoading(true);

    // On mappe les champs du formulaire vers le DTO attendu par le backend
    const profileData: any = {
      firstName,
      lastName,
      locationName,
      locationWKT,
    };

    if (userType === 'candidate') {
      profileData.coverLetterText = presentation;
      profileData.desiredJobTitle = job;
      profileData.experienceLevel = experience;
      if (contractType) {
        profileData.desiredContractTypes = [contractType];
      }
    } else { // Recruiter
      profileData.searchDescription = `${job}\n\n${presentation}`;
      profileData.desiredExperienceLevel = experience;
      if (contractType) {
        profileData.desiredContractTypes = contractType.split(',').map(s => s.trim());
      }
      if (selectedJobCategoryId) {
        profileData.interestedInCategoryIds = [selectedJobCategoryId];
      }
    }

    try {
      await updateProfile(profileData);
      await refreshUser(); // On rafraîchit les données utilisateur

      // Naviguer vers l'écran de profil final
      if (userType === 'candidate') {
        navigation.replace('CandidateProfile', { startEditing: false });
      } else {
        // Pour le recruteur, après avoir complété son profil perso, on va vers son profil final
        navigation.replace('RecruiterProfile', { startEditing: false });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error("Erreur lors de l'enregistrement du profil.", errorMessage);
      alert("Erreur lors de l'enregistrement du profil: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={100}
      >
        <View style={styles.header}>
          <MovaLogo />
          <Text style={styles.title}>Complétez votre profil</Text>
          <Text style={styles.subtitle}>
            {userType === 'candidate' ? 'Candidat' : 'Recruteur'}
          </Text>
        </View>

        <View style={styles.formCard}>
          {/* Image Picker */}
          <TouchableOpacity style={styles.imagePicker} onPress={async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
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

          {/* Raison Sociale (Recruteur seulement) */}
          {userType === 'recruiter' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Raison Sociale</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: '#888' }]} value={companyName} editable={false} />
              </View>
            </View>
          )}

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
            {/* Rendu conditionnel du composant GooglePlacesAutocomplete */}
            {GOOGLE_PLACES_API_KEY && typeof GOOGLE_PLACES_API_KEY === 'string' && GOOGLE_PLACES_API_KEY.length > 0 ? (
              <GooglePlacesAutocomplete
                placeholder='Ville, Pays'
                fetchDetails={true} // Assure que les détails complets sont récupérés
                onPress={(data, details: GooglePlaceDetail | null = null) => {
                  // Sécurité : s'assurer que address_components est un tableau
                  const addressComponents = details?.address_components ?? [];
                  const city = addressComponents.find(c => c.types?.includes('locality'))?.long_name
                    ?? addressComponents.find(c => c.types?.includes('administrative_area_level_2'))?.long_name
                    ?? details?.name // Fallback au nom du lieu si pas de ville spécifique
                    ?? data.description; // Fallback à la description de la prédiction

                  const locationGeometry = details?.geometry?.location;
                  if (locationGeometry) {
                    const { lat, lng } = locationGeometry;
                    setLocationName(city);
                    setLocationWKT(`POINT(${lng} ${lat})`);
                  } else {
                    setLocationName(city); // On garde le nom de la ville même sans coordonnées
                    setLocationWKT('');
                  }
                }}
                query={{
                  key: GOOGLE_PLACES_API_KEY, // Cette clé est maintenant garantie d'être définie
                  language: 'fr',
                  types: '(cities)',
                }}
                predefinedPlaces={[]} // Évite .filter sur undefined si non fourni
                filterReverseGeocodingByTypes={[]} // Évite .filter sur undefined si non fourni
                nearbyPlacesAPI="GooglePlacesSearch" // Valeur par défaut, plus sûre
                textInputProps={{
                  value: locationName,
                  onChangeText: (text) => {
                    setLocationName(text);
                    if (text === '') {
                      setLocationWKT('');
                    }
                  },
                  style: [styles.input, { flex: 1 }],
                  placeholderTextColor: '#999',
                }}
                styles={{
                  container: {
                    flex: 1,
                  },
                  textInputContainer: {
                    ...styles.inputContainer,
                    paddingLeft: 0, // Remove default padding
                  },
                  textInput: {
                    ...styles.input,
                    paddingLeft: 10, // Add custom padding
                  },
                  listView: {
                    backgroundColor: 'white',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: '#ddd',
                    marginTop: 4,
                  },
                  description: {},
                  row: {},
                }}
                renderLeftButton={() =>
                  <Ionicons name="location-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                }
                enablePoweredByContainer={false}
                onFail={(error) => console.log('GooglePlacesAutocomplete FAIL', error)}
                onNotFound={() => console.log('GooglePlacesAutocomplete NOT FOUND')}
              />
            ) : (
              // Fallback UI si la clé API est manquante
              <View>
                <View style={[styles.inputContainer, { backgroundColor: '#f0f0f0' }]}>
                  <Ionicons name="location-outline" size={20} color='#999' style={styles.inputIcon} />
                  <TextInput style={[styles.input, { color: '#999' }]} value="Configuration API manquante" editable={false} />
                </View>
                <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                  La clé API Google Places n'est pas configurée.
                </Text>
              </View>
            )}
          </View>

          {/* Poste */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Poste</Text>
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
            <Text style={styles.label}>Présentation (max 5 lignes)</Text>
            <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start' }]}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color='#4930a3' style={[styles.inputIcon, { paddingTop: 15 }]} />
              <TextInput 
                style={[styles.input, { paddingTop: 15, textAlignVertical: 'top' }]} 
                placeholder="Parlez-nous de vous..." 
                placeholderTextColor="#999" 
                value={presentation} 
                onChangeText={setPresentation} 
                multiline 
                maxLength={250}
                numberOfLines={5}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Enregistrer</Text>
            )}
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
                <ScrollView>
                  {jobCategories.map(cat => (
                    <Pressable
                      key={cat.id}
                      style={styles.modalOption}
                      onPress={() => {
                        setJob(cat.name);
                        setSelectedJobCategoryId(cat.id);
                        setJobModalVisible(false);
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{cat.name}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Modal for Experience */}
          <Modal
            visible={experienceModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setExperienceModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setExperienceModalVisible(false)}>
              <View style={styles.smallModalContent}>
                {experienceLevels.map((level, index) => (
                  <Pressable
                    key={index}
                    style={styles.modalOption}
                    onPress={() => {
                      setExperience(level);
                      setExperienceModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{level}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Modal for Contract Type */}
          <Modal
            visible={contractModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setContractModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setContractModalVisible(false)}>
              <View style={styles.smallModalContent}>
                {contractTypes.map((type, index) => (
                  <Pressable
                    key={index}
                    style={styles.modalOption}
                    onPress={() => {
                      setContractType(type);
                      setContractModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{type}</Text>
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
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 16, minWidth: 220, maxHeight: '60%' },
  smallModalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    minWidth: 220,
  },
  modalOption: { paddingVertical: 12, alignItems: 'flex-start' },
});