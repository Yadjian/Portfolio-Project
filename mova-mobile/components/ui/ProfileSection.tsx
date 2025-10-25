import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface ProfileSectionProps {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  iconColor?: string;
  children: React.ReactNode;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, icon, iconColor = Colors.light.primary, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      {icon && <Feather name={icon} size={22} color={iconColor} />}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.light.backgroundCard,
    marginHorizontal: 8,
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 8,
  },
  sectionContent: {
    marginTop: 15,
  },
});

export default ProfileSection;