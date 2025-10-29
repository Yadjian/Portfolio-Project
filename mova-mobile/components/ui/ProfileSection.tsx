import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

/**
 * ProfileSection
 *
 * A reusable section component for profile screens.
 *
 * Main features:
 * - Displays a section with a title, optional icon, and content.
 * - Uses consistent styling for background, padding, and shadow.
 * - Accepts custom icon and color.
 *
 * Props:
 * - title: string — section title.
 * - icon?: keyof typeof Feather.glyphMap — optional Feather icon name.
 * - iconColor?: string — optional icon color (default: theme primary).
 * - children: React.ReactNode — section content.
 *
 * Key logic:
 * - Renders icon and title in the header.
 * - Wraps children in a styled container.
 */

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
