import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert, StyleSheet, Dimensions, ScrollView, TextInput, Modal, Pressable } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getRecruiterTabs } from '../../constants/tabsConfig';
import MovaLogo from '../../components/ui/MovaLogo';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');

type OfferCard = {
  offerUrl?: string | null;
  showForm?: boolean;
  loading?: boolean;
  error?: string;
  title?: string;
  description?: string;
  contractType?: string;
  hoursPerWeek?: string;
  location?: string;
  salaryMin?: string;
  salaryMax?: string;
};

export default function RecruiterJobOfferScreen({ navigation }: any) {
  const [cards, setCards] = useState<OfferCard[]>([]);
  const [contractModalVisible, setContractModalVisible] = useState(false);
  const [contractIdx, setContractIdx] = useState<number | null>(null);

  // Ajoute une nouvelle card vide EN HAUT
  const addCard = () => setCards(cards => [{} , ...cards]);

  // Helpers pour gérer le state de chaque card
  const updateCard = (idx: number, changes: Partial<OfferCard>) => {
    setCards(cards =>
      cards.map((card, i) => (i === idx ? { ...card, ...changes } : card))
    );
  };

  // Gestion des actions pour chaque card
  const handleUpload = async (idx: number) => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateCard(idx, { loading: true, error: '' });
      try {
        const asset = result.assets[0];
        setTimeout(() => {
          updateCard(idx, { offerUrl: asset.uri, loading: false });
        }, 1200);
      } catch (e) {
        updateCard(idx, { error: "Erreur lors de l'upload", loading: false });
      }
    }
  };

  const handleDelete = (idx: number) => {
    Alert.alert(
      "Supprimer l'offre",
      "Voulez-vous vraiment supprimer cette offre ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => setCards(cards => cards.filter((_, i) => i !== idx)),
        }
      ]
    );
  };

  const handleCreateOffer = (idx: number) => {
    const card = cards[idx];
    if (
      !card.title ||
      !card.contractType ||
      !card.hoursPerWeek ||
      !card.location ||
      !card.salaryMin ||
      !card.salaryMax
    ) {
      updateCard(idx, { error: 'Tous les champs sont obligatoires sauf la description.' });
      return;
    }
    updateCard(idx, { loading: true, error: '' });
    setTimeout(() => {
      setCards(cards => {
        const newCard = { ...cards[idx], loading: false, showForm: false };
        return cards.map((card, i) => (i === idx ? newCard : card));
      });
      Alert.alert('Succès', 'Offre créée !');
    }, 800);
  };

  // Sélecteur déroulant pour type de contrat
  const openContractModal = (idx: number) => {
    setContractIdx(idx);
    setContractModalVisible(true);
  };

  const selectContractType = (type: string) => {
    if (contractIdx !== null) {
      updateCard(contractIdx, { contractType: type });
    }
    setContractModalVisible(false);
    setContractIdx(null);
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
          <Text style={styles.title}>Mes Offres</Text>
          <Text style={styles.subtitle}>Gérez vos offres d'emploi ici.</Text>
        </View>
            {cards.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyCardText}>
                  Aucune offre ajoutée pour l'instant.
                </Text>
                <TouchableOpacity
                  style={styles.addIconEmpty}
                  onPress={addCard}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle" size={40} color="#4930a3" />
                </TouchableOpacity>
              </View>
            )}
            {cards.map((card, idx) => (
              <View key={idx} style={styles.card}>
                {/* Icone poubelle pour supprimer la card */}
                <TouchableOpacity
                  style={styles.trashIcon}
                  onPress={() => handleDelete(idx)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                </TouchableOpacity>
                {card.offerUrl ? (
                  <View style={{ marginBottom: 24 }}>
                    <Text style={styles.label}>Offre importée :</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(card.offerUrl!)}>
                      <Text style={styles.link}>Voir mon offre</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => updateCard(idx, { offerUrl: null })}
                      style={[styles.submitButton, styles.secondaryButton, { marginTop: 12 }]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.submitButtonText, styles.secondaryButtonText]}>Remplacer l'offre</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  // Affiche "Aucune offre importée" seulement si la fiche n'est pas créée
                  !card.title && <Text style={{ marginBottom: 24 }}>Aucune offre importée.</Text>
                )}
                {card.loading ? (
                  <ActivityIndicator color="#6746a8" />
                ) : (
                  // Affiche les boutons seulement si la card n'a pas de fiche créée et pas d'offre importée
                  !card.title && !card.offerUrl && (
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        onPress={() => updateCard(idx, { showForm: !card.showForm })}
                        activeOpacity={0.8}
                        style={styles.submitButton}
                      >                        
                        <Text style={styles.submitButtonText}>Créer une offre</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleUpload(idx)}
                        activeOpacity={0.8}
                        style={[styles.submitButton, styles.secondaryButton, { marginTop: 12 }]}
                      >
                        <Text style={[styles.submitButtonText, styles.secondaryButtonText]}>Importer une offre</Text>
                      </TouchableOpacity>
                    </View>
                  )
                )}
                {card.showForm && (
                  <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Titre de l'offre</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="briefcase-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                        <TextInput style={styles.input} value={card.title || ''} onChangeText={text => updateCard(idx, { title: text })} placeholder="Développeur React Native" placeholderTextColor="#999" />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Description (optionnel)</Text>
                      <View style={[styles.inputContainer, { height: 100, alignItems: 'flex-start' }]}>
                        <Ionicons name="document-text-outline" size={20} color='#4930a3' style={[styles.inputIcon, { paddingTop: 15 }]} />
                        <TextInput style={[styles.input, { paddingTop: 15, textAlignVertical: 'top' }]} value={card.description || ''} onChangeText={text => updateCard(idx, { description: text })} placeholder="Description du poste..." placeholderTextColor="#999" multiline />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Type de contrat</Text>
                      <TouchableOpacity style={styles.inputContainer} onPress={() => openContractModal(idx)}>
                        <Ionicons name="document-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                        <Text style={[styles.input, !card.contractType && styles.placeholder]}>{card.contractType || 'Sélectionner un type'}</Text>
                        <Ionicons name="chevron-down-outline" size={20} color="#999" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Heures / semaine</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="time-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                        <TextInput style={styles.input} value={card.hoursPerWeek || ''} onChangeText={text => updateCard(idx, { hoursPerWeek: text })} placeholder="Ex: 35" keyboardType="numeric" />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Localisation</Text>
                      <View style={styles.inputContainer}>
                        <Ionicons name="location-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                        <TextInput style={styles.input} value={card.location || ''} onChangeText={text => updateCard(idx, { location: text })} placeholder="Ville, Région..." />
                      </View>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Salaire (Brut Annuel)</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[styles.inputContainer, { width: '48%' }]}>
                          <Ionicons name="cash-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                          <TextInput style={styles.input} value={card.salaryMin || ''} onChangeText={text => updateCard(idx, { salaryMin: text })} placeholder="Min" keyboardType="numeric" />
                        </View>
                        <View style={[styles.inputContainer, { width: '48%' }]}>
                          <Ionicons name="cash-outline" size={20} color='#4930a3' style={styles.inputIcon} />
                          <TextInput style={styles.input} value={card.salaryMax || ''} onChangeText={text => updateCard(idx, { salaryMax: text })} placeholder="Max" keyboardType="numeric" />
                        </View>
                      </View>
                    </View>

                    <View style={styles.formButtonRow}>
                      <TouchableOpacity
                        onPress={() => handleCreateOffer(idx)}
                        activeOpacity={0.8}
                        style={[styles.submitButton, { flex: 1 }]}
                      >
                        <Text style={styles.submitButtonText}>Valider</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => updateCard(idx, { showForm: false })}
                        activeOpacity={0.8}
                        style={[styles.submitButton, styles.secondaryButton, { flex: 1, marginLeft: 12 }]}
                      >
                        <Text style={[styles.submitButtonText, styles.secondaryButtonText]}>Annuler</Text>
                      </TouchableOpacity>
                    </View>
                    {card.error ? <Text style={{ color: 'red', marginTop: 8 }}>{card.error}</Text> : null}
                  </View>
                )}
                {card.error && !card.showForm ? <Text style={{ color: 'red', marginTop: 16 }}>{card.error}</Text> : null}
                {/* Ajoute le bouton + seulement sur la première card si elle est remplie */}
                {idx === 0 && (card.title || card.offerUrl) && (
                  <TouchableOpacity
                    style={styles.addIconInCard}
                    onPress={addCard}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add-circle" size={40} color="#4930a3" />
                  </TouchableOpacity>
                )}
                {/* Affiche la fiche du poste et le bouton Modifier */}
                {!card.showForm && card.title && (
                  <>
                    <View style={styles.offerDetailsContainer}>
                      <Text style={styles.detailTitle}>{card.title}</Text>
                      {card.description ? (
                        <Text style={styles.detailText}>{card.description}</Text>
                      ) : null}
                      <View style={styles.tagsContainer}>
                        {card.contractType && <Text style={styles.tag}>{card.contractType}</Text>}
                        {card.hoursPerWeek && <Text style={styles.tag}>{card.hoursPerWeek}h/sem</Text>}
                        {card.location && <Text style={styles.tag}>{card.location}</Text>}
                        {(card.salaryMin || card.salaryMax) && <Text style={styles.tag}>{card.salaryMin}€ - {card.salaryMax}€</Text>}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={[styles.submitButton, { alignSelf: 'flex-start', paddingHorizontal: 20, height: 44, marginTop: 16 }]}
                      activeOpacity={0.8}
                      onPress={() => updateCard(idx, { showForm: true })}
                    >
                      <Text style={styles.submitButtonText}>Modifier</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))}
            <View style={{ height: 100 }} />
        {/* Modal déroulant pour type de contrat */}
        <Modal
          visible={contractModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setContractModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setContractModalVisible(false)}>
            <Pressable style={styles.modalContent}>
              {['CDI', 'CDD', 'STAGE', 'ALTERNANCE'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.modalOption}
                  onPress={() => selectContractType(opt)}
                >
                  <Text style={styles.modalOptionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </Pressable>
          </TouchableOpacity>
        </Modal>
      </KeyboardAwareScrollView>
      <BottomTabBar tabs={getRecruiterTabs(navigation)} activeTabId="offre" />
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scrollContainer: {
    flex: 1,
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
    padding: 28,
    shadowColor: '#6746a8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emptyCardText: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 16,
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
  link: {
    color: '#4930a3',
    textDecorationLine: 'underline',
    fontSize: 16,
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
    height: '100%',
  },
  placeholder: {
    color: '#999',
  },
  addIconInCard: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    zIndex: 10,
  },
  addIconEmpty: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    zIndex: 10,
  },
  trashIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 8,
  },
  buttonRow: {
    marginTop: 8,
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
  detailText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
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
    overflow: 'hidden', // for iOS to respect borderRadius
  },
});