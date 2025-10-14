import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Linking, Alert, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getCandidateTabs } from '../../constants/tabsConfig';
import SmallMovaLogo from '../../components/ui/SmallMovaLogo';
import { LinearGradient } from 'expo-linear-gradient';

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
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoContainer]}>
          <SmallMovaLogo />
          <Text style={styles.title}>Mon CV</Text>
        </View>
        <View style={{ height: height * 0.055 }} />
        <View style={[styles.card, { paddingHorizontal: width * 0.06 }]}>
          {cvUrl ? (
            <View style={{ marginBottom: 24 }}>
              <Text style={styles.label}>CV importé :</Text>
              <TouchableOpacity onPress={() => Linking.openURL(cvUrl)}>
                <Text style={styles.link}>Voir mon CV</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.cvButton, { backgroundColor: '#e74c3c', marginTop: 12 }]}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Supprimer mon CV</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ marginBottom: 24 }}>Aucun CV importé.</Text>
          )}
          {loading ? (
            <ActivityIndicator color="#6746a8" />
          ) : (
            <TouchableOpacity
              onPress={handleUpload}
              activeOpacity={0.8}
              style={styles.cvButton}
            >
              <LinearGradient
                colors={['#6746a8', '#6b25f9', '#07b9ff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.cvButtonText}>Importer mon CV</Text>
            </TouchableOpacity>
          )}
          {error ? <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text> : null}
        </View>
        <View style={{ height: height * 0.08 }} />
      </ScrollView>
      <BottomTabBar tabs={getCandidateTabs(navigation)} activeTabId="cv" />
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
  cvButton: {
    width: width * 0.4,
    alignSelf: 'center',
    height: height * 0.055,
    borderRadius: height * 0.027,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
    overflow: 'hidden',
  },
  cvButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    zIndex: 1,
  },
});