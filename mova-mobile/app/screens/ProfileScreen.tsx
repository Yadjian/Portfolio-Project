import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ActiveToggle from '../../components/ui/ActiveToggle';
import IdentityCard from '../../components/ui/IdentityCard';
import EditProfileButton from '../../components/ui/EditProfileButton';
import BottomTabBar from '../../components/ui/BottomTabBar';
import SmallMovaLogo from '../../components/ui/SmallMovaLogo';

export default function ProfileScreen() {
  const { width, height } = useWindowDimensions();
  const [isActive, setIsActive] = useState(true);
  const navigation = useNavigation();

  // Déterminer le type d'utilisateur (à récupérer depuis le contexte/store)
  const userType = 'candidat'; // ou 'recruteur'

  const user = {
    name: 'Lucas Boyadjian',
    email: 'luc.boyadjian@gmail.com',
    avatarUrl: '',
    phone: '06 59 21 96 61',
    location: 'Fréjus, France',
    age: '25 ans',
    company: 'Tech Solutions', // Seulement pour les recruteurs
    sector: 'Informatique', // Seulement pour les recruteurs
  };

  const handleToggleActive = (value: boolean) => {
    setIsActive(value);
    console.log(`Statut changé: ${value ? 'Activé' : 'Désactivé'}`);
  };

  const handleEditProfile = () => {
    console.log('Modifier le profil');
  };

  // Configuration des onglets selon le type d'utilisateur
  const getTabsForUserType = () => {
    const baseTabs = [
      {
        id: 'profile',
        iconName: 'card-outline',
        iconNameActive: 'card',
        label: 'Mon Profil',
        onPress: () => console.log('Déjà sur Mon Profil'),
      },
    ];

    if (userType === 'candidat') {
      return [
        ...baseTabs,
        {
          id: 'cv',
          iconName: 'document-text-outline',
          iconNameActive: 'document-text',
          label: 'Mon CV',
          onPress: () => console.log('Navigation vers Mon CV'),
        },
        {
          id: 'matches',
          iconName: 'heart-outline',
          iconNameActive: 'heart',
          label: 'Matchs',
          onPress: () => console.log('Navigation vers Mes matchs'),
        },
        {
          id: 'home',
          iconName: 'home-outline',
          iconNameActive: 'home',
          label: 'Home',
          onPress: () => navigation.goBack(),
        }
      ];
    } else {
      // recruteur
      return [
        ...baseTabs,
        {
          id: 'offre',
          iconName: 'document-text-outline',
          iconNameActive: 'document-text',
          label: 'Mon Offre',
          onPress: () => console.log('Navigation vers Mon Offre Détaillée'),
        },
        {
          id: 'matches',
          iconName: 'people-outline',
          iconNameActive: 'people',
          label: 'Candidats',
          onPress: () => console.log('Navigation vers Candidats matchés'),
        },
        {
          id: 'home',
          iconName: 'home-outline',
          iconNameActive: 'home',
          label: 'Home',
          onPress: () => navigation.goBack(),
        }
      ];
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Logo Mova centré en haut */}
        <View style={styles.logoContainer}>
          <SmallMovaLogo />
        </View>

        {/* Espace pour descendre tout le bloc plus bas */}
        <View style={styles.mainSpacer} />

        <View style={styles.container}>
          {/* Ligne avec toggle à gauche et bouton d'édition à droite */}
          <View style={styles.actionRow}>
            <View style={styles.toggleWrapper}>
              <ActiveToggle 
                isActive={isActive}
                onToggle={handleToggleActive}
              />
            </View>
            <EditProfileButton onPress={handleEditProfile} />
          </View>
        </View>

        {/* Carte d'identité SORTIE du conteneur avec padding */}
        <IdentityCard
          avatarUrl={user.avatarUrl}
          name={user.name}
          email={user.email}
          phone={user.phone}
          location={user.location}
          age={user.age}
        />

        <View style={styles.container}>
          {/* Espace pour éviter que le contenu soit caché par la navigation */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Barre de navigation adaptée au type d'utilisateur */}
      <BottomTabBar tabs={getTabsForUserType()} activeTabId="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  mainSpacer: {
    height: 60, // Grand espace pour descendre tout le bloc
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  toggleWrapper: {
    flex: 1,
  },
  bottomSpacer: {
    height: 70,
  },
});