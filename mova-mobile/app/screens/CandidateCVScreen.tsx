import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useFocusEffect } from '@react-navigation/native';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getCandidateTabs } from '../../constants/tabsConfig';
import { Ionicons } from '@expo/vector-icons';
import { uploadResume, deleteResume, getMyProfile } from '../../services/api';

const { width, height } = Dimensions.get('window');

/**
 * CandidateCVScreen
 *
 * This screen allows candidates to upload, view, and delete their resume (CV).
 *
 * Main features:
 * - Fetches the current CV from the backend every time the screen is focused.
 * - Allows the user to upload a new CV (PDF) using the device's file picker.
 * - Allows the user to delete their existing CV.
 * - Displays the current CV file name and a link to view it if uploaded.
 * - Handles loading and error states for all actions.
 * - Shows a bottom tab bar for candidate navigation.
 *
 * Key logic:
 * - Uses useFocusEffect to refresh the CV on screen focus.
 * - Uses expo-document-picker for file selection.
 * - Calls backend API to upload or delete the CV.
 * - Handles UI state for loading, errors, and file info.
 */

export default function CandidateCVScreen({ navigation }: any) {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load the CV every time the page is focused (comes to the foreground)
  useFocusEffect(
    useCallback(() => {
      const loadExistingCV = async () => {
        try {
          const profile = await getMyProfile();
          // The resumeUrl is in candidateProfile, not at the root
          const resumeUrl = profile?.candidateProfile?.resumeUrl || profile?.resumeUrl;
          if (resumeUrl) {
            setCvUrl(resumeUrl);
          } else {
            setCvUrl(null);
          }
        } catch (e) {
          // Error loading CV
          console.error('Erreur chargement CV:', e);
        }
      };
      loadExistingCV();
    }, [])
  );

  // Handle uploading a new CV
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

  // Handle deleting the current CV
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
        {/* Header section with title and subtitle */}
        <View style={styles.header}>          
          <Text style={styles.title}>Mon CV</Text>
          <Text style={styles.subtitle}>Importez ou mettez à jour votre CV.</Text>
        </View>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator color="#6746a8" />
          ) : (
            <>
              {/* If a CV is uploaded, show info and actions */}
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
                // If no CV is uploaded, show placeholder
                <View style={styles.noCvContainer}>
                  <Ionicons name="cloud-offline-outline" size={40} color="#999" />
                  <Text style={styles.noCvText}>Aucun CV importé pour le moment.</Text>
                </View>
              )}

              {/* Button to upload or update CV */}
              <TouchableOpacity style={styles.submitButton} onPress={handleUpload}>
                <Text style={styles.submitButtonText}>{cvUrl ? 'Mettre à jour le CV' : 'Importer mon CV'}</Text>
              </TouchableOpacity>
            </>
          )}
          {/* Display error message if any */}
          {error ? <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text> : null}
        </View>
      </ScrollView>
      {/* Bottom tab bar for candidate navigation */}
      <BottomTabBar tabs={getCandidateTabs(navigation)} activeTabId="cv" />
    </View>
  );
}

// Styles for the CandidateCVScreen component
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