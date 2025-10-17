import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors'; // Using the new color palette

interface SwipeCardProps {
  userType: 'candidate' | 'recruiter';
  avatarUrl: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  location?: string;
  job?: string;
  jobSeeking?: string;
  experience?: string;
  experienceRequired?: string;
  presentation?: string;
  contractType?: string;
}

// Redesigned InfoTag
const InfoTag = ({ icon, text }: { icon: keyof typeof Feather.glyphMap; text: string }) => (
  <View style={styles.tag}>
    <Feather name={icon} size={14} color={Colors.light.primary} />
    <Text style={styles.tagText}>{text}</Text>
  </View>
);

export default function SwipeCard(props: SwipeCardProps) {
  const { width } = useWindowDimensions();
  // The card height can be adjusted if needed, but we'll make it content-driven
  const cardHeight = width * 1.3;

  const { userType, avatarUrl, firstName, lastName, companyName, location, job, jobSeeking, experience, experienceRequired, presentation, contractType } = props;

  const name = userType === 'candidate' ? `${firstName} ${lastName}` : companyName;
  const mainRole = userType === 'candidate' ? job : jobSeeking;
  const exp = userType === 'candidate' ? experience : experienceRequired;

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/icon.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name}</Text>
        {location && (
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.location}>{location}</Text>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.mainRole}>{mainRole}</Text>
        <View style={styles.tagsContainer}>
          {exp && <InfoTag icon="bar-chart-2" text={exp} />}
          {contractType && <InfoTag icon="file-text" text={contractType} />}
        </View>
        <Text style={styles.presentationTitle}>Présentation</Text>
        <Text style={styles.presentationText} numberOfLines={6}>
          {presentation || 'Aucune présentation disponible.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 15,
    backgroundColor: '#e5e5e5',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  location: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginLeft: 5,
  },
  infoSection: {
    padding: 20,
    flex: 1,
  },
  mainRole: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
    backgroundColor: Colors.light.background, // Light grey background for tags
  },
  tagText: {
    color: Colors.light.primary,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
  },
  presentationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  presentationText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    lineHeight: 20,
  },
});
