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
import CustomPlacesAutocomplete, { Suggestion } from '../../../components/ui/CustomPlacesAutocomplete';
import Constants from 'expo-constants';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * EditProfileScreen
 *
 * This screen allows the user (candidate or recruiter) to edit their profile information.
 *
 * Main features:
 * - Handles form state for all profile fields (name, location, job, experience, contract, presentation, etc.).
 * - Allows picking and uploading a profile photo.
 * - Uses Google Places Autocomplete for location selection.
 * - Fetches dropdown options (contract types, experience levels, job categories) from the backend.
 * - Pre-fills the form with current user data.
 * - Validates required fields before saving.
 * - Calls the backend to update the profile and uploads the avatar if changed.
 * - Navigates to the correct profile screen after saving.
 * - Handles loading and error states.
 * - Uses modals for job, experience, and contract selection.
 * - Uses KeyboardAwareScrollView for mobile UX.
 *
 * Key logic:
 * - Uses useEffect to fetch metadata and pre-fill form fields.
 * - Uses useFocusEffect to refresh user data after update.
 * - Maps form fields to the backend DTO for updateProfile.
 * - Handles both candidate and recruiter profile logic.
 */

export default function EditProfileScreen() {
  // Navigation and route hooks
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'EditProfileScreen'>>();
  const { userType, userId, companyName: companyNameFromNav } = route.params;
  const { refreshUser } = useAuth();

  // State for keyboard visibility
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Google Places API key (from app config or environment)
  const GOOGLE_PLACES_API_KEY =
    Constants.expoConfig?.extra?.GOOGLE_PLACES_API_KEY
    ?? process.env.GOOGLE_PLACES_API_KEY;

  // Candidate profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationWKT, setLocationWKT] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const [job, setJob] = useState('');
  const [selectedJobCategoryId, setSelectedJobCategoryId] = useState<string | null>(null);
  const [jobModalVisible, setJobModalVisible] = useState(false);
  const [experience, setExperience] = useState('');
  const [contractType, setContractType] = useState('');
  const [presentation, setPresentation] = useState('');

  // Recruiter profile field
  const [companyName, setCompanyName] = useState(companyNameFromNav || '');

  // State for modal visibility
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);

  // Loading state for async actions
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown options for contract types, experience levels, and job categories
  const [contractTypes, setContractTypes] = useState<any[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<any[]>([]);
  const [jobCategories, setJobCategories] = useState<{ id: string; name: string }[]>([]);

  // Listen for keyboard show/hide events to adjust UI if needed
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

  // Fetch contract types, experience levels, and job categories from the backend
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
        // Sort categories alphabetically for better UX
        const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name));
        setJobCategories(sortedCategories);
      } catch (error) {
      }
    };

    fetchMetaData();
  }, []);

  // Pre-fill form fields with current user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      setIsLoading(true);

      try {
        const data = await getMyProfile();

        if (!data) {
          return;
        }

        // Select the correct profile type based on userType
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
        }

      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, userType]);

  // Handle form submission and profile update
  const handleSubmit = async () => {
    // Validate all required fields (except presentation)
    const missingFields: string[] = [];
    if (!firstName.trim()) missingFields.push('prénom');
    if (!lastName.trim()) missingFields.push('nom');
    if (!locationName.trim()) missingFields.push('localisation');
    if (!job.trim()) missingFields.push('poste');
    if (!experience.trim()) missingFields.push('expérience');
    if (!contractType.trim()) missingFields.push('type de contrat');
    if (userType === 'recruiter' && !companyName.trim()) missingFields.push('raison sociale');

    if (missingFields.length > 0) {
      // Alert for missing required fields
      alert('Merci de remplir les champs obligatoires :\n' + missingFields.join(', '));
      return;
    }
    setIsLoading(true);

    // Map form fields to the DTO expected by the backend
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
      await updateProfile(profileData, selectedPhotoUri || undefined);
      await refreshUser(); // Refresh user data after update

      // Navigate to the final profile screen
      if (userType === 'candidate') {
        navigation.replace('CandidateProfile', { startEditing: false });
      } else {
        // For recruiter, after completing personal profile, go to final profile
        navigation.replace('RecruiterProfile', { startEditing: false });
      }
    } catch (error) {
      // Error saving profile
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      // (console.error retiré)
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
        {/* Header with logo and profile type */}
        <View style={styles.header}>
          <MovaLogo />
          <Text style={styles.title}>Complétez votre profil</Text>
          <Text style={styles.subtitle}>
            {userType === 'candidate' ? 'Candidat' : 'Recruteur'}
          </Text>
        </View>

        <View style={styles.formCard}>
          {/* Image Picker for avatar */}
          <TouchableOpacity style={styles.imagePicker} onPress={async () => {
            // Request permissions first
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need permission to access your photos!');
              return;
            }
            
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const uri = result.assets[0].uri;
              setAvatarUrl(uri); // Local display
              setSelectedPhotoUri(uri); // Store for upload
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

          {/* Company Name (Recruiter only, read-only) */}
          {userType === 'recruiter' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Raison Sociale</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                <TextInput style={[styles.input, { color: '#888' }]} value={companyName} editable={false} />
              </View>
            </View>
          )}

          {/* First Name input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Prénom</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Votre prénom" placeholderTextColor="#999" value={firstName} onChangeText={setFirstName} />
            </View>
          </View>

          {/* Last Name input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Votre nom" placeholderTextColor="#999" value={lastName} onChangeText={setLastName} />
            </View>
          </View>

          {/* Location input with Google Places Autocomplete */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Localisation</Text>
            {/* Conditional rendering of GooglePlacesAutocomplete component */}
            {GOOGLE_PLACES_API_KEY && typeof GOOGLE_PLACES_API_KEY === 'string' && GOOGLE_PLACES_API_KEY.length > 0 ? (
              <CustomPlacesAutocomplete
                apiKey={GOOGLE_PLACES_API_KEY}
                value={locationName}
                onSelect={async (item: Suggestion) => {
                  setLocationName(item.description);
                  // Fetch details for coordinates, city, and country
                  try {
                    const res = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=${GOOGLE_PLACES_API_KEY}&language=fr`);
                    const data = await res.json();
                    if (data.status === 'OK') {
                      const details = data.result;
                      const comps = details.address_components || [];
                      
                      // Extract city
                      const city = comps.find((c: any) => c.types?.includes('locality'))?.long_name
                        ?? comps.find((c: any) => c.types?.includes('postal_town'))?.long_name
                        ?? comps.find((c: any) => c.types?.includes('administrative_area_level_2'))?.long_name
                        ?? details.name
                        ?? item.description;
                      
                      // Extract country
                      const country = comps.find((c: any) => c.types?.includes('country'))?.long_name ?? '';
                      
                      // Combine city and country
                      const formattedLocation = country ? `${city}, ${country}` : city;
                      
                      // Extract coordinates
                      const loc = details.geometry && details.geometry.location ? details.geometry.location : null;
                      
                      setLocationName(formattedLocation);
                      if (loc) setLocationWKT(`POINT(${loc.lng} ${loc.lat})`);
                      else setLocationWKT('');
                    } else {
                      setLocationWKT('');
                    }
                  } catch (e) {
                    setLocationWKT('');
                  }
                }}
              />
            ) : (
              // Fallback UI if API key is missing
              <View>
                <View style={[styles.inputContainer, { backgroundColor: '#f0f0f0' }]}>
                  <Ionicons name="location-outline" size={20} color='#999' style={styles.inputIcon} />
                  <TextInput style={[styles.input, { color: '#999' }]} value="Configuration API manquante" editable={false} />
                </View>
                <Text style={{ color: 'red', fontSize: 12, marginTop: 4 }}>
                  Google Places API key is not configured.
                </Text>
              </View>
            )}
          </View>

          {/* Job Title selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Poste</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setJobModalVisible(true)}>
              <Ionicons name="briefcase-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <Text style={[styles.input, !job && styles.placeholder]}>{job || 'Sélectionner un poste'}</Text>
              <Ionicons name="chevron-down-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Experience selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expérience</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setExperienceModalVisible(true)}>
              <Ionicons name="analytics-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <Text style={[styles.input, !experience && styles.placeholder]}>{experience || 'Sélectionner une expérience'}</Text>
              <Ionicons name="chevron-down-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Contract Type selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type de contrat</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setContractModalVisible(true)}>
              <Ionicons name="document-text-outline" size={20} color='#4930a3' style={styles.inputIcon} />
              <Text style={[styles.input, !contractType && styles.placeholder]}>{contractType || 'Sélectionner un contrat'}</Text>
              <Ionicons name="chevron-down-outline" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Presentation (cover letter) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Présentation (max 250 caractères)</Text>
            <View style={[styles.inputContainer, { height: 140, alignItems: 'flex-start' }]}>
              <Ionicons name="chatbox-ellipses-outline" size={20} color='#4930a3' style={[styles.inputIcon, { paddingTop: 15 }]} />
              <TextInput 
                style={[styles.input, { paddingTop: 15, textAlignVertical: 'top', height: 120 }]} 
                placeholder="Parlez-nous de vous..." 
                placeholderTextColor="#999" 
                value={presentation} 
                onChangeText={setPresentation} 
                multiline 
                maxLength={250}
                scrollEnabled={true}
              />
            </View>
          </View>

          {/* Submit button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>

          {/* Job Title Modal */}
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

          {/* Experience Modal */}
          <Modal
            visible={experienceModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setExperienceModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setExperienceModalVisible(false)}>
              <View style={styles.smallModalContent}>
                {experienceLevels.map((level, index) => {
                  const displayText = typeof level === 'string' ? level : level.label || level.value;
                  const valueText = typeof level === 'string' ? level : level.value;
                  return (
                    <Pressable
                      key={index}
                      style={styles.modalOption}
                      onPress={() => {
                        setExperience(valueText);
                        setExperienceModalVisible(false);
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{displayText}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Contract Type Modal */}
          <Modal
            visible={contractModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setContractModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setContractModalVisible(false)}>
              <View style={styles.smallModalContent}>
                {contractTypes.map((type, index) => {
                  const displayText = typeof type === 'string' ? type : type.label || type.value;
                  const valueText = typeof type === 'string' ? type : type.value;
                  return (
                    <Pressable
                      key={index}
                      style={styles.modalOption}
                      onPress={() => {
                        setContractType(valueText);
                        setContractModalVisible(false);
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{displayText}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
        {/* Spacer at the bottom */}
        <View style={{ height: 40 }} /> 
      </KeyboardAwareScrollView>
    </View>
  );
}

// Styles for the EditProfileScreen component
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
    elevation: 3,
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
    marginTop: 10,
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