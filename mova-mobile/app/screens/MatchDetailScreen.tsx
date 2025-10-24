import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { getMatchDetails } from '../../services/api';

export default function MatchDetailScreen({ route, navigation }: { route: any; navigation: any }) {
  const { matchId, userType } = route.params;
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await getMatchDetails(matchId);
        console.log('Match details:', data);
        setDetails(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du match:', error);
        Alert.alert('Erreur', 'Impossible de charger les détails du match');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [matchId]);

  const handleOpenCV = async (cvUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(cvUrl);
      if (supported) {
        await Linking.openURL(cvUrl);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir le CV');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ouverture du CV:', error);
      Alert.alert('Erreur', 'Impossible d\'ouvrir le CV');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Aucun détail disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4930a3" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détails du Match</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {userType === 'candidate' ? (
          // Candidat voit les Job Offers
          details.map((jobOffer: any, index: number) => (
            <View key={jobOffer.id || index} style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="briefcase" size={32} color="#4930a3" />
                <Text style={styles.cardTitle}>{jobOffer.title}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Entreprise</Text>
                <Text style={styles.value}>{jobOffer.company?.name || 'Non spécifié'}</Text>
              </View>

              {/* Récupérer le nom du recruteur depuis createdBy */}
              {jobOffer.createdBy && (
                <View style={styles.section}>
                  <Text style={styles.label}>Recruteur</Text>
                  <Text style={styles.value}>
                    {jobOffer.createdBy.firstName} {jobOffer.createdBy.lastName}
                  </Text>
                </View>
              )}

              {jobOffer.locationName && (
                <View style={styles.section}>
                  <Text style={styles.label}>Localisation</Text>
                  <Text style={styles.value}>{jobOffer.locationName}</Text>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.label}>Type de contrat</Text>
                <Text style={styles.value}>{jobOffer.contractType}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.label}>Expérience requise</Text>
                <Text style={styles.value}>{jobOffer.experienceLevel || 'Non spécifié'}</Text>
              </View>

              {jobOffer.workHours && (
                <View style={styles.section}>
                  <Text style={styles.label}>Heures / semaine</Text>
                  <Text style={styles.value}>{jobOffer.workHours}</Text>
                </View>
              )}

              {(jobOffer.salaryMin || jobOffer.salaryMax) && (
                <View style={styles.section}>
                  <Text style={styles.label}>Salaire (Brut Mensuel)</Text>
                  <Text style={styles.value}>
                    {jobOffer.salaryMin} - {jobOffer.salaryMax} {jobOffer.currency || '€'}
                  </Text>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.label}>Mission(s)</Text>
                <Text style={styles.description}>{jobOffer.description}</Text>
              </View>
            </View>
          ))
        ) : (
          // Recruteur voit le profil du candidat avec son CV
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={32} color="#4930a3" />
              <Text style={styles.cardTitle}>
                {details.firstName} {details.lastName}
              </Text>
            </View>

            {details.desiredJobTitle && (
              <View style={styles.section}>
                <Text style={styles.label}>Poste recherché</Text>
                <Text style={styles.value}>{details.desiredJobTitle}</Text>
              </View>
            )}

            {details.experienceLevel && (
              <View style={styles.section}>
                <Text style={styles.label}>Niveau d'expérience</Text>
                <Text style={styles.value}>{details.experienceLevel}</Text>
              </View>
            )}

            {details.desiredContractTypes && details.desiredContractTypes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.label}>Type de contrat souhaité</Text>
                <Text style={styles.value}>{details.desiredContractTypes[0]}</Text>
              </View>
            )}

            {details.locationName && (
              <View style={styles.section}>
                <Text style={styles.label}>Localisation</Text>
                <Text style={styles.value}>{details.locationName}</Text>
              </View>
            )}

            {details.coverLetterText && (
              <View style={styles.section}>
                <Text style={styles.label}>Présentation</Text>
                <Text style={styles.description}>{details.coverLetterText}</Text>
              </View>
            )}

            {/* Bouton CV */}
            {details.resumeUrl && (
              <TouchableOpacity
                style={styles.cvButton}
                onPress={() => handleOpenCV(details.resumeUrl)}
              >
                <Ionicons name="document-text" size={24} color="#fff" />
                <Text style={styles.cvButtonText}>Télécharger le CV</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4930a3',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4930a3',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  cvButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4930a3',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  cvButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
});
