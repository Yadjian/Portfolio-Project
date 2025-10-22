import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Dimensions, ScrollView, TextInput, Modal, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Ionicons, Feather } from '@expo/vector-icons';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getRecruiterTabs } from '../../constants/tabsConfig';
import { useAuth } from '../../contexts/AuthContext';
import { getMyJobOffers, createJobOffer, updateJobOffer, deleteJobOffer, getContractTypes } from '../../services/api';

const { width } = Dimensions.get('window');

// Le type pour une offre d'emploi, incluant l'état de l'UI
type JobOfferUI = {
  id?: string; // L'ID n'existe que pour les offres déjà créées
  title: string;
  description: string;
  contractType: string;
  workHours: string;
  experienceLevel?: string; // Ajout du niveau d'expérience
  locationName?: string; // Ajout du nom de la localisation pour l'UI
  locationWKT: string;
  salaryMin: number | null;
  salaryMax: number | null;
  // États pour l'UI
  isNew?: boolean; // Marqueur pour une nouvelle offre non sauvegardée
  showForm: boolean;
  loading?: boolean;
  error?: string;
};

export default function RecruiterJobOfferScreen() {
  const navigation = useNavigation();
  const { user } = useAuth(); // On récupère l'utilisateur connecté
  const [offers, setOffers] = useState<JobOfferUI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [editingOfferIndex, setEditingOfferIndex] = useState<number | null>(null);
  const [contractTypes, setContractTypes] = useState<string[]>([]);

  // --- DATA FETCHING ---

  // Fetch metadata like contract types once
  useEffect(() => {
    const fetchMetaData = async () => {
      try {
        const contracts = await getContractTypes();
        setContractTypes(contracts);
      } catch (error) {
        console.error("Erreur lors de la récupération des types de contrat:", error);
      }
    };
    fetchMetaData();
  }, []);

  const fetchOffers = useCallback(async (isActive = true) => {
    try {
      setIsLoading(true);
      const fetchedOffers = await getMyJobOffers(); // API call

      if (isActive) {
        if (fetchedOffers) { // Vérifie si fetchedOffers n'est pas null ou undefined
          const uiOffers: JobOfferUI[] = fetchedOffers.map((offer: any) => ({
            ...offer,
            locationName: user?.recruiterProfile?.locationName || offer.locationName, // Assurer que le nom de la localisation est présent
            salaryMin: offer.salaryMin, // Garder en nombre
            salaryMax: offer.salaryMax, // Garder en nombre
            showForm: false, // Par défaut, les formulaires sont cachés
          }));
          setOffers(uiOffers);
        } else {
          // Si fetchedOffers est null (par exemple, en cas de 401), on initialise avec un tableau vide
          setOffers([]);
        }
      }
    } catch (error) {
      if (isActive) {
        console.error("Erreur lors de la récupération des offres:", error);
        Alert.alert("Erreur", "Impossible de charger vos offres.");
      }
    } finally {
      if (isActive) {
        setIsLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Flag to prevent state updates if component is unmounted
      fetchOffers(isActive);

      return () => {
        isActive = false; // Cleanup function
      };
    }, [fetchOffers])
  );

  // --- UI STATE HELPERS ---
  const updateOfferState = (index: number, changes: Partial<JobOfferUI>) => {
    setOffers(currentOffers =>
      currentOffers.map((offer, i) => (i === index ? { ...offer, ...changes } : offer))
    );
  };

  const addOfferCard = () => {
    const recruiterProfile = user?.recruiterProfile;

    // On vérifie que le profil est complet avant de permettre la création
    if (!recruiterProfile || !recruiterProfile.searchedCategories?.length || !recruiterProfile.desiredContractTypes?.length || !recruiterProfile.desiredExperienceLevel) {
      Alert.alert(
        "Profil incomplet",
        "Veuillez compléter votre profil (poste, contrat, expérience) avant d'ajouter une offre.",
        [{ text: "OK", onPress: () => navigation.navigate('RecruiterProfile' as never) }]
      );
      return;
    }

    // Ajoute une carte de formulaire vide en haut de la liste
    const newOffer: JobOfferUI = {
      isNew: true,
      showForm: true,
      title: recruiterProfile.searchedCategories[0]?.name || '', // Titre hérité du profil
      description: '',
      contractType: recruiterProfile.desiredContractTypes[0] || '', // Contrat hérité du profil
      experienceLevel: recruiterProfile.desiredExperienceLevel || '', // Expérience héritée du profil
      workHours: '',
      locationName: recruiterProfile.locationName || '', // Nom de la localisation hérité du profil
      locationWKT: recruiterProfile.locationWKT || 'POINT(2.3522 48.8566)', // Hérité du profil, avec un fallback
      salaryMin: null,
      salaryMax: null,
    };
    setOffers(currentOffers => [newOffer, ...currentOffers]);
  };

  // --- API ACTIONS ---
  const handleSave = async (index: number) => {
    const offer = offers[index];
    updateOfferState(index, { loading: true, error: '' });

    // Validation simple
    if (!offer.title || !offer.description) {
      updateOfferState(index, { loading: false, error: 'Titre, description et contrat sont requis.' });
      return;
    }

    const payload = {
      title: offer.title,
      description: offer.description,
      workHours: offer.workHours,
      locationName: offer.locationName, // On envoie aussi le nom de la localisation
      locationWKT: offer.locationWKT, // On utilise la localisation de l'offre (héritée du profil)
      salaryMin: offer.salaryMin ? parseInt(offer.salaryMin.toString(), 10) : undefined,
      salaryMax: offer.salaryMax ? parseInt(offer.salaryMax.toString(), 10) : undefined,
      // contractType et experienceLevel sont hérités du profil côté backend, donc non envoyés
    };
    try {
      if (offer.isNew) {
        const newOffer = await createJobOffer(payload);

        // Remplace la carte "new" par la carte de l'offre sauvegardée
        updateOfferState(index, {
          ...newOffer,
          isNew: false,
          showForm: false,
          loading: false,
        });
      } else {
        const updatedOffer = await updateJobOffer(offer.id!, payload);

        // Met à jour l'offre existante et ferme le formulaire
        updateOfferState(index, {
          ...updatedOffer,
          showForm: false,
          loading: false,
        });
      }
      Alert.alert('Succès', `Offre ${offer.isNew ? 'créée' : 'mise à jour'} !`);
      // Le rechargement complet n'est plus nécessaire, l'état est mis à jour localement.
    } catch (error: any) {
      console.error("Erreur sauvegarde offre:", error);
      updateOfferState(index, { loading: false, error: error.message || 'Une erreur est survenue.' });
    }
  };

  const handleDelete = async (index: number) => {
    const offer = offers[index];
    if (offer.isNew) {
      // Si c'est une nouvelle carte non sauvegardée, on la retire juste de l'UI
      setOffers(current => current.filter((_, i) => i !== index));
      return;
    }

    Alert.alert(
      "Supprimer l'offre",
      "Voulez-vous vraiment supprimer cette offre ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteJobOffer(offer.id!);
              // Retire l'offre de la liste au lieu de tout recharger
              setOffers(current => current.filter((_, i) => i !== index));
              Alert.alert('Succès', 'Offre supprimée.');
            } catch (error: any) {
              Alert.alert("Erreur", error.message || "Impossible de supprimer l'offre.");
            }
          },
        },
      ]
    );
  };

  // --- MODAL HELPERS ---
  const openContractModal = (index: number) => {
    setEditingOfferIndex(index);
    setContractModalVisible(true);
  };

  const selectContractType = (type: string) => {
    if (editingOfferIndex !== null) {
      updateOfferState(editingOfferIndex, { contractType: type });
    }
    setContractModalVisible(false);
    setEditingOfferIndex(null);
  };

  // --- RENDER ---
  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#4930a3" /></View>;
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mes Offres</Text>
          <Text style={styles.subtitle}>Gérez vos offres d'emploi ici.</Text>
        </View>

        {offers.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>Aucune offre pour le moment.</Text>
          </View>
        )}

        {/* Bouton pour ajouter une offre, toujours visible en haut */}
        <TouchableOpacity style={styles.addOfferButton} onPress={addOfferCard} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.addOfferButtonText}>Ajouter une offre</Text>
        </TouchableOpacity>

        {offers.map((offer, idx) => (
          <View key={offer.id || `new-${idx}`} style={styles.card}>
            {/* Icône de suppression en haut à droite */}
            <TouchableOpacity style={styles.trashIcon} onPress={() => handleDelete(idx)} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={22} color="#e74c3c" />
            </TouchableOpacity>

            {offer.loading && <ActivityIndicator color="#6746a8" />}

            {offer.showForm ? (
              // --- FORMULAIRE D'ÉDITION/CRÉATION ---
              <View style={styles.formContainer}>
                 <View style={styles.inputGroup}>
                  <Text style={styles.label}>Poste</Text>
                  <View style={[styles.inputContainer, styles.readOnlyContainer]}>
                    <Ionicons name="briefcase-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                    <Text style={[styles.input, styles.readOnlyText]}>{offer.title}</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Localisation</Text>
                  <View style={[styles.inputContainer, styles.readOnlyContainer]}>
                    <Ionicons name="location-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                    <Text style={[styles.input, styles.readOnlyText]}>{offer.locationName || 'Définie dans votre profil'}</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Type de contrat</Text>
                  <View style={[styles.inputContainer, styles.readOnlyContainer]}>
                    <Ionicons name="document-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                    <Text style={[styles.input, styles.readOnlyText]}>{offer.contractType}</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Expérience requise</Text>
                  <View style={[styles.inputContainer, styles.readOnlyContainer]}>
                    <Ionicons name="analytics-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                    <Text style={[styles.input, styles.readOnlyText]}>{offer.experienceLevel}</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Heures / semaine</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="time-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                    <TextInput style={styles.input} value={offer.workHours} onChangeText={text => updateOfferState(idx, { workHours: text })} placeholder="Ex: 35" keyboardType="numeric" />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Salaire (Brut Mensuel)</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={[styles.inputContainer, { width: '48%' }]}>
                      <Ionicons name="cash-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                      <TextInput style={styles.input} value={offer.salaryMin?.toString() ?? ''} onChangeText={text => updateOfferState(idx, { salaryMin: text ? parseInt(text) : null })} placeholder="Min" keyboardType="numeric" />
                    </View>
                    <View style={[styles.inputContainer, { width: '48%' }]}>
                      <Ionicons name="cash-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                      <TextInput style={styles.input} value={offer.salaryMax?.toString() ?? ''} onChangeText={text => updateOfferState(idx, { salaryMax: text ? parseInt(text) : null })} placeholder="Max" keyboardType="numeric" />
                    </View>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Description</Text>
                  <View style={[styles.inputContainer, { height: 100, alignItems: 'flex-start' }]}>
                    <Ionicons name="document-text-outline" size={20} color='#4930a3' style={[styles.inputIcon, { paddingTop: 15 }]} />
                    <TextInput style={[styles.input, { paddingTop: 15, textAlignVertical: 'top' }]} value={offer.description} onChangeText={text => updateOfferState(idx, { description: text })} placeholder="Description du poste..." placeholderTextColor="#999" multiline />
                  </View>
                </View>

                <View style={styles.formButtonRow}>
                  <TouchableOpacity onPress={() => handleSave(idx)} activeOpacity={0.8} style={[styles.submitButton, { flex: 1 }]} disabled={offer.loading}>
                    <Text style={styles.submitButtonText}>Valider</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => offer.isNew ? handleDelete(idx) : updateOfferState(idx, { showForm: false })} activeOpacity={0.8} style={[styles.submitButton, styles.secondaryButton, { flex: 1, marginLeft: 12 }]}>
                    <Text style={[styles.submitButtonText, styles.secondaryButtonText]}>Annuler</Text>
                  </TouchableOpacity>
                </View>
                {offer.error ? <Text style={{ color: 'red', marginTop: 8 }}>{offer.error}</Text> : null}
              </View>
            ) : (
              // --- AFFICHAGE DE L'OFFRE ---
              <>
                <View style={styles.offerDetailsContainer}>
                  <Text style={styles.detailTitle}>{offer.title}</Text>
                  {offer.locationName && (
                    <View style={styles.locationContainer}>
                      <Ionicons name="location-outline" size={14} color="#666" />
                      <Text style={styles.locationText}>{offer.locationName}</Text>
                    </View>
                  )}
                  <View style={styles.tagsContainer}>
                    {offer.contractType && <Text style={styles.tag}>{offer.contractType}</Text>}
                    {offer.workHours && <Text style={styles.tag}>{offer.workHours}h/sem</Text>}
                    {offer.experienceLevel && <Text style={styles.tag}>{offer.experienceLevel}</Text>}
                    {(offer.salaryMin || offer.salaryMax) && <Text style={styles.tag}>{offer.salaryMin}€ - {offer.salaryMax}€</Text>}
                  </View>
                  {offer.description ? <Text style={[styles.detailText, {marginTop: 12}]}>{offer.description}</Text> : null}
                </View>

                {/* Icône d'édition en bas à droite */}
                <TouchableOpacity style={styles.editIcon} onPress={() => updateOfferState(idx, { showForm: true })} activeOpacity={0.7}>
                  <Feather name="edit-2" size={20} color="#4930a3" />
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}

        <View style={{ height: 100 }} />
      </KeyboardAwareScrollView>

      {/* Modal pour le type de contrat */}
      <Modal
        visible={contractModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setContractModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setContractModalVisible(false)}>
          <Pressable style={styles.modalContent}>
            {contractTypes.map(opt => (
              <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => selectContractType(opt)}>
                <Text style={styles.modalOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </TouchableOpacity>
      </Modal>

      <BottomTabBar tabs={getRecruiterTabs(navigation)} activeTabId="offre" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
  addOfferButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4930a3',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#4930a3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  addOfferButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 28,
    shadowColor: '#6746a8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  emptyCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginBottom: 24,
  },
  emptyCardText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#4930a3',
    borderRadius: 14,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4930a3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1.5,
    borderColor: '#4930a3',
    elevation: 0,
    shadowOpacity: 0,
  },
  secondaryButtonText: {
    color: '#4930a3',
  },
  formContainer: {
    marginTop: 16,
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
  readOnlyContainer: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e0e0e0',
  },
  readOnlyText: {
    color: '#777',
  },
  trashIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
  },
  editIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    padding: 8,
    borderRadius: 20,
  },
  formButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOption: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#333',
  },
  offerDetailsContainer: {
    marginTop: 8,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e8e8e8',
    color: '#555',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    overflow: 'hidden',
  },
});
