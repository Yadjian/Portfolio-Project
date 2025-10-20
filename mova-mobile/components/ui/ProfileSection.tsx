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
    marginTop: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginLeft: 10,
  },
  sectionContent: {
    marginTop: 15,
  },
});

export default ProfileSection;