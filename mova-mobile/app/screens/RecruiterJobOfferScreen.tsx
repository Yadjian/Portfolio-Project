import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert, StyleSheet, Dimensions, ScrollView, TextInput, Modal } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getRecruiterTabs } from '../../constants/tabsConfig';
import SmallMovaLogo from '../../components/ui/SmallMovaLogo';
import { LinearGradient } from 'expo-linear-gradient';
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
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.logoContainer}>
              <SmallMovaLogo />
              <Text style={styles.title}>Mes offres</Text>
            </View>
            <View style={{ height: height * 0.03 }} />
            {cards.length === 0 && (
              <View style={styles.emptyCard}>
                <Text style={{ textAlign: 'center', color: '#aaa', marginBottom: 16 }}>
                  Aucune offre ajoutée pour l'instant.
                </Text>
                <TouchableOpacity
                  style={styles.addIconEmpty}
                  onPress={addCard}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add-circle" size={30} color="#6746a8" />
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
                      onPress={() => handleDelete(idx)}
                      style={[styles.offerButton, { backgroundColor: '#e74c3c', marginTop: 12 }]}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.offerButtonText}>Supprimer cette offre</Text>
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
                        onPress={() => handleUpload(idx)}
                        activeOpacity={0.8}
                        style={styles.offerButton}
                      >
                        <LinearGradient
                          colors={['#6746a8', '#6b25f9', '#07b9ff']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={StyleSheet.absoluteFill}
                        />
                        <Text style={styles.offerButtonText}>Importer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => updateCard(idx, { showForm: !card.showForm })}
                        activeOpacity={0.8}
                        style={[styles.offerButton, { marginLeft: 12 }]}
                      >
                        <LinearGradient
                          colors={['#6746a8', '#6b25f9', '#07b9ff']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={StyleSheet.absoluteFill}
                        />
                        <Text style={styles.offerButtonText}>Créer</Text>
                      </TouchableOpacity>
                    </View>
                  )
                )}
                {card.showForm && (
                  <View style={styles.formContainer}>
                    <Text style={styles.label}>Titre de l'offre</Text>
                    <TextInput
                      style={styles.input}
                      value={card.title || ''}
                      onChangeText={text => updateCard(idx, { title: text })}
                      placeholder="Titre"
                    />
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                      style={[styles.input, { height: 80 }]}
                      value={card.description || ''}
                      onChangeText={text => updateCard(idx, { description: text })}
                      placeholder="Description"
                      multiline
                    />
                    <Text style={styles.label}>Type de contrat</Text>
                    <TouchableOpacity
                      style={[styles.input, { justifyContent: 'center' }]}
                      onPress={() => openContractModal(idx)}
                    >
                      <Text style={{ color: card.contractType ? '#222' : '#aaa', fontSize: width * 0.04 }}>
                        {card.contractType || 'Sélectionner'}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.label}>Heures de travail / semaine</Text>
                    <TextInput
                      style={styles.input}
                      value={card.hoursPerWeek || ''}
                      onChangeText={text => updateCard(idx, { hoursPerWeek: text })}
                      placeholder="Ex: 35"
                      keyboardType="numeric"
                    />
                    <Text style={styles.label}>Localisation</Text>
                    <TextInput
                      style={styles.input}
                      value={card.location || ''}
                      onChangeText={text => updateCard(idx, { location: text })}
                      placeholder="Ville, Région..."
                    />
                    <Text style={styles.label}>Salaire minimum (€)</Text>
                    <TextInput
                      style={styles.input}
                      value={card.salaryMin || ''}
                      onChangeText={text => updateCard(idx, { salaryMin: text })}
                      placeholder="Ex: 1800"
                      keyboardType="numeric"
                    />
                    <Text style={styles.label}>Salaire maximum (€)</Text>
                    <TextInput
                      style={styles.input}
                      value={card.salaryMax || ''}
                      onChangeText={text => updateCard(idx, { salaryMax: text })}
                      placeholder="Ex: 2500"
                      keyboardType="numeric"
                    />
                    <View style={styles.formButtonRow}>
                      <TouchableOpacity
                        onPress={() => handleCreateOffer(idx)}
                        activeOpacity={0.8}
                        style={[styles.offerButton, { backgroundColor: '#07b9ff', marginRight: 12 }]}
                      >
                        <Text style={styles.offerButtonText}>Valider</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => updateCard(idx, { showForm: false })}
                        activeOpacity={0.8}
                        style={[styles.offerButton, { backgroundColor: '#6b25f9' }]}
                      >
                        <Text style={styles.offerButtonText}>Annuler</Text>
                      </TouchableOpacity>
                    </View>
                    {card.error ? <Text style={{ color: 'red', marginTop: 8 }}>{card.error}</Text> : null}
                  </View>
                )}
                {card.error && !card.showForm ? <Text style={{ color: 'red', marginTop: 16 }}>{card.error}</Text> : null}
                {/* Ajoute le bouton + seulement sur la dernière card */}
                {idx === cards.length - 1 && !card.showForm && (
                  <TouchableOpacity
                    style={styles.addIconInCard}
                    onPress={addCard}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="add-circle" size={30} color="#6746a8" />
                  </TouchableOpacity>
                )}
                {/* Affiche la fiche du poste et le bouton Modifier */}
                {!card.showForm && card.title && (
                  <>
                    <View style={{ marginBottom: 16 }}>
                      <Text style={styles.label}>Titre : <Text style={{ fontWeight: 'normal' }}>{card.title}</Text></Text>
                      {card.description ? (
                        <Text style={styles.label}>Description : <Text style={{ fontWeight: 'normal' }}>{card.description}</Text></Text>
                      ) : null}
                      {card.contractType ? (
                        <Text style={styles.label}>Type de contrat : <Text style={{ fontWeight: 'normal' }}>{card.contractType}</Text></Text>
                      ) : null}
                      {card.hoursPerWeek ? (
                        <Text style={styles.label}>Heures/semaine : <Text style={{ fontWeight: 'normal' }}>{card.hoursPerWeek}</Text></Text>
                      ) : null}
                      {card.location ? (
                        <Text style={styles.label}>Localisation : <Text style={{ fontWeight: 'normal' }}>{card.location}</Text></Text>
                      ) : null}
                      {(card.salaryMin || card.salaryMax) && (
                        <Text style={styles.label}>
                          Salaire : <Text style={{ fontWeight: 'normal' }}>
                            {card.salaryMin ? `${card.salaryMin}€` : ''}{card.salaryMin && card.salaryMax ? ' - ' : ''}{card.salaryMax ? `${card.salaryMax}€` : ''}
                          </Text>
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={[styles.offerButton, { backgroundColor: '#6b25f9', alignSelf: 'flex-start', marginBottom: 12 }]}
                      activeOpacity={0.8}
                      onPress={() => updateCard(idx, { showForm: true })}
                    >
                      <Text style={styles.offerButtonText}>Modifier</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))}
            <View style={{ height: height * 0.08 }} />
          </ScrollView>
        </View>
        {/* Modal déroulant pour type de contrat */}
        <Modal
          visible={contractModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setContractModalVisible(false)}
        >
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setContractModalVisible(false)}>
            <View style={styles.modalContent}>
              {['CDI', 'CDD', 'STAGE', 'ALTERNANCE'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.modalOption}
                  onPress={() => selectContractType(opt)}
                >
                  <Text style={{ fontSize: 18 }}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAwareScrollView>
      <BottomTabBar tabs={getRecruiterTabs(navigation)} activeTabId="offre" />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: width * 0.08,
    color: '#6746a8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: width * 0.045,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.06,
    marginHorizontal: width * 0.02,
    marginBottom: height * 0.02,
    shadowColor: '#6746a8',
    shadowOpacity: 0.08,
    shadowRadius: width * 0.03,
    elevation: 4,
    position: 'relative',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: width * 0.045,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.06,
    marginHorizontal: width * 0.02,
    marginBottom: height * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  label: {
    fontWeight: 'bold',
    color: '#6746a8',
    marginBottom: height * 0.01,
    fontSize: width * 0.045,
  },
  link: {
    color: '#07b9ff',
    textDecorationLine: 'underline',
    marginBottom: height * 0.015,
    fontSize: width * 0.045,
  },
  offerButton: {
    width: width * 0.2,
    alignSelf: 'center',
    height: height * 0.040,
    borderRadius: height * 0.027,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
    overflow: 'hidden',
    position: 'relative',
  },
  offerButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    zIndex: 1,
  },
  formContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f7f7fa',
    borderRadius: width * 0.03,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: width * 0.02,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 10,
    marginBottom: 16,
    fontSize: width * 0.04,
  },
  addIconInCard: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 10,
  },
  addIconEmpty: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 10,
  },
  trashIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  formButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0006',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    minWidth: 220,
  },
  modalOption: {
    paddingVertical: 12,
    alignItems: 'center',
  },
});