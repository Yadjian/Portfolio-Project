import React from 'react';
import { View, Text, ImageBackground, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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

const InfoTag = ({ icon, text }: { icon: any; text: string }) => (
  <LinearGradient
    colors={['#6746a8', '#6b25f9', '#07b9ff']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.tag}
  >
    <Ionicons name={icon} size={16} color="#fff" />
    <Text style={styles.tagText}>{text}</Text>
  </LinearGradient>
);

export default function SwipeCard(props: SwipeCardProps) {
  const { width } = useWindowDimensions();
  const cardHeight = width * 1.5; // Increased height ratio

  const { userType, avatarUrl, firstName, lastName, companyName, location, job, jobSeeking, experience, experienceRequired, presentation, contractType } = props;

  const name = userType === 'candidate' ? `${firstName} ${lastName}` : companyName;
  const mainRole = userType === 'candidate' ? job : jobSeeking;
  const exp = userType === 'candidate' ? experience : experienceRequired;

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <ImageBackground
        source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/splash-icon.png')}
        style={styles.image}
        imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <Text style={styles.name}>{name}</Text>
          {location && <Text style={styles.location}>{location}</Text>}
        </LinearGradient>
      </ImageBackground>
      <View style={styles.infoSection}>
          <View style={styles.tagsContainer}>
            {mainRole && <InfoTag icon="briefcase-outline" text={mainRole} />}
            {exp && <InfoTag icon="bar-chart-outline" text={exp} />}
            {contractType && <InfoTag icon="document-text-outline" text={contractType} />}
          </View>
          <Text style={styles.presentationText} numberOfLines={5} ellipsizeMode="clip">
            {presentation}
          </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    overflow: 'hidden', // Prevents content from overflowing rounded corners
  },
  image: {
    width: '100%',
    height: '60%', // Adjusted ratio
    justifyContent: 'flex-end',
  },
  gradient: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  location: {
    fontSize: 18,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoSection: {
    padding: 15,
    height: '40%', // Adjusted ratio
    justifyContent: 'flex-start',
  },
  presentationText: {
    fontSize: 15,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'left',
    flexShrink: 1, // Ensure text does not overflow
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 15,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});