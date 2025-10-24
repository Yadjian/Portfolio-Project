import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getCandidateTabs } from '../../constants/tabsConfig';
import { Ionicons } from '@expo/vector-icons';
import { uploadResume, deleteResume, getMyProfile } from '../../services/api';

const { width, height } = Dimensions.get('window');

export default function CandidateCVScreen({ navigation }: any) {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Charger le CV à chaque fois que la page est focus (revient au premier plan)
  useFocusEffect(
    useCallback(() => {
      const loadExistingCV = async () => {
        try {
          const profile = await getMyProfile();
          
          // Le resumeUrl est dans candidateProfile, pas à la racine
          const resumeUrl = profile?.candidateProfile?.resumeUrl || profile?.resumeUrl;
          if (resumeUrl) {
            setCvUrl(resumeUrl);
          } else {
            setCvUrl(null);
          }
        } catch (e) {
          console.error('Erreur chargement CV:', e);
        }
      };
      loadExistingCV();
    }, [])
  );

  const handleUpload = async () => {
    setError('');
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLoading(true);
      try {
        const asset = result.assets[0];
        const data = await uploadResume({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType ?? 'application/pdf',
        });
        
        if (data?.resumeUrl) {
          setCvUrl(data.resumeUrl);
          Alert.alert('Succès', data.message || 'CV importé avec succès !');
        }
      } catch (e: any) {
        setError(e.message || 'Erreur lors de l\'upload');
        Alert.alert('Erreur', e.message || 'Impossible d\'importer le CV');
      }
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Supprimer le CV",
      "Voulez-vous vraiment supprimer votre CV ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteResume();
              setCvUrl(null);
              Alert.alert('Succès', 'CV supprimé avec succès !');
            } catch (e: any) {
              setError(e.message || 'Erreur lors de la suppression');
              Alert.alert('Erreur', e.message || 'Impossible de supprimer le CV');
            }
            setLoading(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>          
          <Text style={styles.title}>Mon CV</Text>
          <Text style={styles.subtitle}>Importez ou mettez à jour votre CV.</Text>
        </View>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color="#6746a8" />
          ) : (
            <>
              {cvUrl ? (
                <View style={styles.cvInfoContainer}>
                  <Ionicons name="document-attach-outline" size={24} color="#4930a3" />
                  <View style={styles.cvInfoText}>
                    <Text style={styles.cvFileName}>Mon_CV.pdf</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(cvUrl)}>
                      <Text style={styles.link}>Voir le CV</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={24} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.noCvContainer}>
                  <Ionicons name="cloud-offline-outline" size={40} color="#999" />
                  <Text style={styles.noCvText}>Aucun CV importé pour le moment.</Text>
                </View>
              )}

              <TouchableOpacity style={styles.submitButton} onPress={handleUpload}>
                <Text style={styles.submitButtonText}>{cvUrl ? 'Mettre à jour le CV' : 'Importer mon CV'}</Text>
              </TouchableOpacity>
            </>
          )}
          {error ? <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text> : null}
        </View>
      </ScrollView>
      <BottomTabBar tabs={getCandidateTabs(navigation)} activeTabId="cv" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#6746a8',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: '80%',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: width * 0.045,
    paddingVertical: height * 0.04,
    paddingHorizontal: width * 0.06,
    shadowColor: '#6746a8',
    shadowOpacity: 0.08,
    shadowRadius: width * 0.03,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  cvInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cvInfoText: {
    flex: 1,
    marginLeft: 12,
  },
  cvFileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  link: {
    color: '#4930a3',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginTop: 4,
  },
  noCvContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 24,
  },
  noCvText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
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
});