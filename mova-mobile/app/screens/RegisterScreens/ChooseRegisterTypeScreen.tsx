import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import MovaLogo from '@/components/ui/MovaLogo';

const { height, width } = Dimensions.get('window');

/**
 * ChooseRegisterTypeScreen
 *
 * This screen allows the user to select their registration type (candidate or recruiter).
 *
 * Main features:
 * - Presents two cards: one for candidates, one for recruiters.
 * - Navigates to the account creation screen with the selected user type.
 * - Shows the app logo, title, and subtitle.
 *
 * Key logic:
 * - Uses navigation to pass the userType param to the CreateAccount screen.
 * - Uses Pressable for interactive cards with visual feedback.
 */

export default function ChooseRegisterTypeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Header with logo and title */}
      <View style={styles.header}>
        <MovaLogo />
        <Text style={styles.title}>Rejoignez-nous</Text>
        <Text style={styles.subtitle}>Choisissez votre profil pour commencer l'aventure Mova.</Text>
      </View>

      {/* Card for candidate registration */}
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => navigation.navigate('CreateAccount', { userType: 'candidate' })}
      >
        <View style={styles.cardContent}>
          <Feather name="user" size={32} color="#4930a3" style={styles.icon} />
          <View>
            <Text style={styles.cardTitle}>Candidat</Text>
            <Text style={styles.cardDescription}>Je cherche un job</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={24} color="#C7C7CC" />
      </Pressable>

      {/* Card for recruiter registration */}
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => navigation.navigate('CreateAccount', { userType: 'recruiter' })}
      >
        <View style={styles.cardContent}>
          <Feather name="briefcase" size={32} color="#4930a3" style={styles.icon} />
          <View>
            <Text style={styles.cardTitle}>Recruteur</Text>
            <Text style={styles.cardDescription}>Je recrute des talents</Text>
          </View>
        </View>
        <Feather name="chevron-right" size={24} color="#C7C7CC" />
      </Pressable>
    </View>
  );
}

// Styles for the ChooseRegisterTypeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: height * 0.1,
    paddingHorizontal: width * 0.05,
  },
  header: {
    alignItems: 'center',
    marginBottom: height * 0.06,
    width: '90%',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 20,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4930a3',
    marginTop: 25,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c2c2e',
  },
  cardDescription: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 5,
  },
});