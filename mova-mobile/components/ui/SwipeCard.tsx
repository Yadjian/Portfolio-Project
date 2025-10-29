import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

/**
 * SwipeCard
 *
 * A card component for swipe interfaces (e.g., Tinder-like).
 *
 * Main features:
 * - Displays user or job info depending on userType (candidate or recruiter).
 * - Shows avatar, name/company, location, job, experience, contract type, and presentation.
 * - Uses InfoTag subcomponent for tags with icons.
 * - Responsive design using useWindowDimensions.
 *
 * Props:
 * - userType: 'candidate' | 'recruiter'
 * - avatarUrl: string
 * - firstName?: string
 * - lastName?: string
 * - companyName?: string
 * - location?: string
 * - job?: string
 * - jobSeeking?: string
 * - experience?: string
 * - experienceRequired?: string
 * - presentation?: string
 * - contractType?: string
 *
 * Key logic:
 * - Adapts displayed fields based on userType.
 * - Fallbacks for missing data.
 */

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
    <Feather name={icon} size={16} color={Colors.light.text} />
    <Text style={styles.tagText}>{text}</Text>
  </View>
);

export default function SwipeCard(props: SwipeCardProps) {
  const { width } = useWindowDimensions();
  // Carte qui prend toute la hauteur disponible
  const cardHeight = '100%';

  const { userType, avatarUrl, firstName, lastName, companyName, location, job, jobSeeking, experience, experienceRequired, presentation, contractType } = props;

  const name = userType === 'candidate' ? `${firstName} ${lastName}` : companyName;
  const mainRole = userType === 'candidate' ? job : jobSeeking;
  const exp = userType === 'candidate' ? experience : experienceRequired;

  return (
    <View style={[styles.card, { height: cardHeight }]} pointerEvents="box-none">
      {/* Header Section */}
      <View style={styles.header} pointerEvents="none">
        {/* Bande violette en arrière-plan */}
        <View style={styles.headerBackground} />
        
        {/* Avatar qui chevauche la bande */}
        <View style={styles.avatarContainer}>
          <Image
            source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/icon.png')}
            style={styles.avatar}
          />
        </View>
        
        <Text style={styles.name}>{name}</Text>
        {location && (
          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={14} color={Colors.light.textSecondary} />
            <Text style={styles.location}>{location}</Text>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoSection} pointerEvents="none">
        <View style={styles.roleContainer}>
          <Feather name="briefcase" size={20} color="#4930a3" />
          <Text style={styles.mainRole}>{mainRole}</Text>
        </View>
        
        <View style={styles.tagsContainer}>
          {exp && <InfoTag icon="trending-up" text={exp} />}
          {contractType && <InfoTag icon="file-text" text={contractType} />}
        </View>

        <View style={styles.divider} />

        <View style={styles.presentationContainer}>
          <View style={styles.presentationHeader}>
            <Feather name="user" size={18} color="#4930a3" />
            <Text style={styles.presentationTitle}>À propos</Text>
          </View>
          <Text style={styles.presentationText}>
            {presentation || 'Aucune présentation disponible.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 24,
    backgroundColor: Colors.light.backgroundCard,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    backgroundColor: Colors.light.backgroundCard,
  },
  headerBackground: {
    backgroundColor: '#4930a3',
    height: 100,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  avatarContainer: {
    marginTop: 30,
    borderWidth: 4,
    borderColor: Colors.light.backgroundCard,
    borderRadius: 74,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e5e5e5',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 4,
  },
  infoSection: {
    padding: 24,
    paddingBottom: 16,
    flex: 1,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(73, 48, 163, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  mainRole: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.light.text,
    marginLeft: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(73, 48, 163, 0.08)',
    gap: 6,
  },
  tagText: {
    color: Colors.light.text,
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
  },
  presentationContainer: {
    flex: 1,
    paddingBottom: 8,
  },
  presentationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  presentationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  presentationText: {
    fontSize: 15,
    color: Colors.light.textSecondary,
    lineHeight: 22,
  },
});
