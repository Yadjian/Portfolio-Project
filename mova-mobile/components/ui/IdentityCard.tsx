import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface IdentityCardProps {
  avatarUrl: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  age: string;
  style?: ViewStyle;
}

export default function IdentityCard({ 
  avatarUrl, 
  name, 
  email, 
  phone, 
  location, 
  age,
  style 
}: IdentityCardProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Section haute : Photo à gauche, infos principales à droite */}
      <View style={styles.topSection}>
        {/* Photo de profil rectangulaire avec bordure dégradée */}
        <LinearGradient
          colors={['#6746a8', '#6b25f9', '#07b9ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.photoGradientBorder}
        >
          <View style={styles.photoContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.photo} />
          </View>
        </LinearGradient>

        {/* Informations principales à droite de la photo */}
        <View style={styles.mainInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.role}>Candidat</Text>
        </View>
      </View>

      {/* Section basse : Détails complets sous la photo */}
      <View style={styles.detailsSection}>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Téléphone:</Text>
          <Text style={styles.detailValue}>{phone}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Localisation:</Text>
          <Text style={styles.detailValue}>{location}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Âge:</Text>
          <Text style={styles.detailValue}>{age}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    width: '90%',
    alignSelf: 'center',
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photoGradientBorder: {
    borderRadius: 10,
    padding: 2, // épaisseur de la bordure dégradée autour de la photo
    marginRight: 16,
  },
  photoContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: 90,
    height: 110,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  role: {
    fontSize: 14,
    color: '#6746a8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6746a8',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    flex: 1.5,
    textAlign: 'right',
    fontWeight: '500',
  },
});