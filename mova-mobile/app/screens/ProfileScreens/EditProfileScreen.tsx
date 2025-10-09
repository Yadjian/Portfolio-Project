import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParamList } from '../../../lib/types';
import { LinearGradient } from 'expo-linear-gradient';
import { updateProfile } from '../../../services/api';
import * as ImagePicker from 'expo-image-picker';
import SmallMovaLogo from '../../../components/ui/SmallMovaLogo';
import { MaterialIcons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import GenericInputBar from '../../../components/ui/TextInput';

export default function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'EditProfileScreen'>>();
  const { userType } = route.params;

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

  const handleSubmit = async () => {
    // Restrictions désactivées pour les tests
    // if (userType === 'candidat') {
    //   if (!firstName || !lastName || !location || !job || !experience || !contractType) {
    //     alert('Tous les champs sont obligatoires sauf la présentation.');
    //     return;
    //   }
    //   try {
    //     await updateProfile({
    //       firstName,
    //       lastName,
    //       location,
    //       job,
    //       experience,
    //       contractType,
    //       presentation,
    //     });
    //     navigation.replace('CandidateProfile', { startEditing: false });
    //   } catch (error) {
    //     alert("Erreur lors de l'enregistrement du profil.");
    //     console.error(error);
    //   }
    // } else {
    //   if (!companyName || !companyLocation || !jobSeeking || !experienceRequired || !companyContractType || !siret) {
    //     alert('Tous les champs sont obligatoires sauf la présentation.');
    //     return;
    //   }
    //   try {
    //     await updateProfile({
    //       companyName,
    //       companyLocation,
    //       jobSeeking,
    //       experienceRequired,
    //       contractType: companyContractType,
    //       presentation: companyPresentation,
    //       siret,
    //     });
    //     navigation.replace('RecruiterProfile', { startEditing: false });
    //   } catch (error) {
    //     alert("Erreur lors de l'enregistrement du profil.");
    //     console.error(error);
    //   }
    // }

    // Navigation directe sans backend ni restriction :
    if (userType === 'candidat') {
      navigation.replace('CandidateProfile', { startEditing: false });
    } else {
      navigation.replace('RecruiterProfile', { startEditing: false });
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid={true}
      extraScrollHeight={120} // augmente si besoin pour le champ présentation
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoContainer}>
        <SmallMovaLogo />
      </View>
      <Text style={styles.title}>Complétez votre profil</Text>
      {userType === 'candidat' ? (
        <>
          <View style={{ alignSelf: 'center', marginBottom: 16 }}>
            <Pressable onPress={async () => {
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [31, 37],
                quality: 0.7,
              });
              if (!result.canceled && result.assets && result.assets.length > 0) {
                setAvatarUrl(result.assets[0].uri);
              }
            }}>
              <LinearGradient
                colors={['#6746a8', '#6b25f9', '#07b9ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 124, // 120 + 2*border
                  height: 148, // 144 + 2*border
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 2,
                }}
              >
                <View style={{ position: 'relative' }}>
                  <Image
                    source={avatarUrl ? { uri: avatarUrl } : require('../../../assets/images/icon.png')}
                    style={{
                      width: 120,
                      height: 144,
                      borderRadius: 8,
                      backgroundColor: '#f8f9fa',
                    }}
                  />
                  <View style={{
                    position: 'absolute',
                    right: 6,
                    bottom: 6,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    padding: 2,
                    elevation: 2,
                  }}>
                    <MaterialIcons name="photo-camera" size={24} color="#6746a8" />
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
          <GenericInputBar
            placeholder="Prénom"
            value={firstName}
            onChangeText={setFirstName}
          />
          <GenericInputBar
            placeholder="Nom"
            value={lastName}
            onChangeText={setLastName}
          />
          <GenericInputBar
            placeholder="Localisation"
            value={location}
            onChangeText={setLocation}
          />
          {/* Picker custom pour Poste recherché */}
          <Pressable
            style={{
              width: '88%',
              alignSelf: 'center',
              marginVertical: 8,
            }}
            onPress={() => setJobModalVisible(true)}
          >
            <LinearGradient
              colors={['#6746a8', '#6b25f9', '#07b9ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 8,
                padding: 2,
              }}
            >
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                minHeight: 48,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                justifyContent: 'space-between',
              }}>
                <Text style={{ color: job ? '#222' : '#aaa', fontSize: 16, flex: 1 }}>
                  {job || 'Poste'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={28} color="#6746a8" />
              </View>
            </LinearGradient>
          </Pressable>
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
          {/* Picker Expérience */}
          <Pressable
            style={{
              width: '88%',
              alignSelf: 'center',
              marginVertical: 8,
            }}
            onPress={() => setExperienceModalVisible(true)}
          >
            <LinearGradient
              colors={['#6746a8', '#6b25f9', '#07b9ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 8,
                padding: 2,
              }}
            >
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                minHeight: 48,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                justifyContent: 'space-between',
              }}>
                <Text style={{ color: experience ? '#222' : '#aaa', fontSize: 16, flex: 1 }}>
                  {experience || 'Expérience'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={28} color="#6746a8" />
              </View>
            </LinearGradient>
          </Pressable>
          <Modal
            visible={experienceModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setExperienceModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setExperienceModalVisible(false)}>
              <View style={styles.modalContent}>
                {['Débutant', 'Intermédiaire', 'Senior'].map(opt => (
                  <Pressable
                    key={opt}
                    style={styles.modalOption}
                    onPress={() => {
                      setExperience(opt);
                      setExperienceModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          {/* Picker Type de contrat */}
          <Pressable
            style={{
              width: '88%',
              alignSelf: 'center',
              marginVertical: 8,
            }}
            onPress={() => setContractModalVisible(true)}
          >
            <LinearGradient
              colors={['#6746a8', '#6b25f9', '#07b9ff']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 8,
                padding: 2,
              }}
            >
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                minHeight: 48,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                justifyContent: 'space-between',
              }}>
                <Text style={{ color: contractType ? '#222' : '#aaa', fontSize: 16, flex: 1 }}>
                  {contractType || 'Type de contrat'}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={28} color="#6746a8" />
              </View>
            </LinearGradient>
          </Pressable>
          <Modal
            visible={contractModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setContractModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setContractModalVisible(false)}>
              <View style={styles.modalContent}>
                {['CDI', 'CDD', 'STAGE', 'ALTERNANCE'].map(opt => (
                  <Pressable
                    key={opt}
                    style={styles.modalOption}
                    onPress={() => {
                      setContractType(opt);
                      setContractModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          <GenericInputBar
            placeholder="Présentation (optionnel)"
            value={presentation}
            onChangeText={setPresentation}
            multiline
          />
        </>
      ) : (
        <>
          <Pressable
            onPress={async () => {
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
              style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 8, borderWidth: 2, borderColor: '#6746a8' }}
            />
            <Text style={{ textAlign: 'center', color: '#6746a8', marginBottom: 16 }}>Modifier la photo</Text>
          </Pressable>
          <GenericInputBar
            placeholder="Nom de l'entreprise"
            value={companyName}
            onChangeText={setCompanyName}
          />
          <GenericInputBar
            placeholder="Localisation"
            value={companyLocation}
            onChangeText={setCompanyLocation}
          />
          <GenericInputBar
            placeholder="Numéro SIRET"
            value={siret}
            onChangeText={setSiret}
            keyboardType="numeric"
          />
          <GenericInputBar
            placeholder="Poste recherché"
            value={jobSeeking}
            onChangeText={setJobSeeking}
          />
          <Pressable
            style={styles.input}
            onPress={() => setExperienceModalVisible(true)}
          >
            <Text style={{ color: experienceRequired ? '#222' : '#aaa', fontSize: 16 }}>
              {experienceRequired || 'Expérience'}
            </Text>
          </Pressable>
          <Modal
            visible={experienceModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setExperienceModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setExperienceModalVisible(false)}>
              <View style={styles.modalContent}>
                {['Débutant', 'Intermédiaire', 'Senior'].map(opt => (
                  <Pressable
                    key={opt}
                    style={styles.modalOption}
                    onPress={() => {
                      setExperienceRequired(opt);
                      setExperienceModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          <Pressable
            style={styles.input}
            onPress={() => setContractModalVisible(true)}
          >
            <Text style={{ color: companyContractType ? '#222' : '#aaa', fontSize: 16 }}>
              {companyContractType || 'Type de contrat'}
            </Text>
          </Pressable>
          <Modal
            visible={contractModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setContractModalVisible(false)}
          >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setContractModalVisible(false)}>
              <View style={styles.modalContent}>
                {['CDI', 'CDD', 'STAGE', 'ALTERNANCE'].map(opt => (
                  <Pressable
                    key={opt}
                    style={styles.modalOption}
                    onPress={() => {
                      setCompanyContractType(opt);
                      setContractModalVisible(false);
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            </TouchableOpacity>
          </Modal>
          <GenericInputBar
            placeholder="Présentation (optionnel)"
            value={companyPresentation}
            onChangeText={setCompanyPresentation}
            multiline
          />
        </>
      )}
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.button, { backgroundColor: '#07b9ff' }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Enregistrer</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: '#6b25f9', marginLeft: 12 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Annuler</Text>
        </Pressable>
      </View>
      <View style={{ height: 80 }} /> {/* marge esthétique en bas */}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingBottom: 20,   // marge en bas
    backgroundColor: '#fffffffb'
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center', color: '#6746a8' },
  label: { marginBottom: 4, fontSize: 16, color: '#222' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 16, padding: 12, borderRadius: 6, backgroundColor: '#fff', fontSize: 16, height: 48, justifyContent: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  button: { borderRadius: 30, paddingVertical: 14, paddingHorizontal: 32 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0006' },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 16, minWidth: 220 },
  modalOption: { paddingVertical: 12, alignItems: 'center' },
  gradientButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
});