import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getCandidateTabs } from '../../constants/tabsConfig';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function CandidateCVScreen({ navigation }: any) {
  const [cvUrl, setCvUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    setError('');
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLoading(true);
      try {
        const asset = result.assets[0];
        const formData = new FormData();
        formData.append('file', {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType ?? 'application/pdf',
        } as any);
        formData.append('user_id', 'USER_ID');
        formData.append('type', 'cv');

        const res = await fetch('https://ton-backend/api/v1/uploads', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer TOKEN', // Ajoute ton token Auth0
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
        const data = await res.json();
        setCvUrl(data.url); // URL Cloudflare R2
      } catch (e) {
        setError('Erreur lors de l\'upload');
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
              // Appelle ton backend pour supprimer le fichier
              await fetch('https://ton-backend/api/v1/uploads/ID_DU_CV', {
                method: 'DELETE',
                headers: {
                  'Authorization': 'Bearer TOKEN',
                },
              });
              setCvUrl(null);
            } catch (e) {
              setError('Erreur lors de la suppression');
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