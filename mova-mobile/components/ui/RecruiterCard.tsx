import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';

interface RecruiterCardProps {
  avatarUrl: string;
  companyName: string;
  location?: string;
  jobSeeking?: string;
  experienceRequired?: string;
  contractType?: string;
  presentation?: string;
}

export default function RecruiterCard({
  avatarUrl,
  companyName,
  location = "",
  jobSeeking = "",
  experienceRequired = "",
  contractType = "",
  presentation = "",
}: RecruiterCardProps) {
  const { width, height } = useWindowDimensions();
  const cardPadding = width * 0.05;
  const photoWidth = width * 0.22;
  const photoHeight = photoWidth * 1.2;

  return (
    <View style={[styles.card, { padding: cardPadding, minHeight: height * 0.6 }]}>
      <View style={styles.topRow}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/icon.png')}
          style={[styles.avatar, { width: photoWidth, height: photoHeight }]}
        />
        <View style={styles.mainInfo}>
          <Text style={[styles.companyName, { fontSize: width * 0.055 }]}>{companyName}</Text>
          <Text style={[styles.location, { fontSize: width * 0.04 }]}>{location}</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { fontSize: width * 0.04 }]}>Poste : </Text>
            <Text style={[styles.value, { fontSize: width * 0.04 }]}>{jobSeeking}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { fontSize: width * 0.04 }]}>Niveau : </Text>
            <Text style={[styles.value, { fontSize: width * 0.04 }]}>{experienceRequired}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { fontSize: width * 0.04 }]}>Type de contrat : </Text>
            <Text style={[styles.value, { fontSize: width * 0.04 }]}>{contractType}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottomBlock}>
        <Text style={[styles.label, { fontSize: width * 0.042 }]}>Présentation :</Text>
        <Text style={[styles.value, { fontSize: width * 0.04 }]}>{presentation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Carte globale
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
    width: '100%',
    justifyContent: 'flex-start',
  },
  // Ligne du haut : photo + infos principales
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    width: '100%',
  },
  avatar: {
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    marginRight: 18,
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  companyName: {
    fontWeight: 'bold',
    color: '#6746a8',
    marginBottom: 2,
    textAlign: 'left',
  },
  location: {
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'flex-start',
  },
  label: {
    fontWeight: '600',
    color: '#6746a8',
    lineHeight: 22,
  },
  value: {
    color: '#222',
    lineHeight: 22,
  },
  // Bloc du bas : présentation
  bottomBlock: {
    marginTop: 18,
    width: '100%',
  },
});