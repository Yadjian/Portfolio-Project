import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '../../constants/tabsConfig';

// --- Données Mock Réalistes ---

const RECRUITER_MATCHES = [
  {
    id: '1',
    companyName: 'Club Med',
    jobTitle: 'Animateur / Animatrice',
    contractType: 'Saisonnier',
    matchDate: '2023-10-28T10:00:00Z',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Club_Med_Logo_Blu.png',
  },
  {
    id: '2',
    companyName: 'Accor Hotels',
    jobTitle: 'Réceptionniste',
    contractType: 'CDI',
    matchDate: '2023-10-27T15:30:00Z',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/17/AccorHotels_Logo_2016.png',
  },
  {
    id: '3',
    companyName: 'McDonald\'s',
    jobTitle: 'Employé polyvalent',
    contractType: 'CDI',
    matchDate: '2023-10-26T12:00:00Z',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_logo.svg/450px-McDonald%27s_logo.svg.png',
  },
  {
    id: '4',
    companyName: 'Zara',
    jobTitle: 'Vendeur / Vendeuse',
    contractType: 'CDD',
    matchDate: '2023-10-25T18:00:00Z',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/800px-Zara_Logo.svg.png',
  },
  {
    id: '5',
    companyName: 'Groupe Partouche',
    jobTitle: 'Croupier / Croupière',
    contractType: 'CDI',
    matchDate: '2023-10-24T20:00:00Z',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Partouche-logo.png',
  },
  {
    id: '6',
    companyName: 'Disneyland Paris',
    jobTitle: "Hôte / Hôtesse d'accueil",
    contractType: 'Saisonnier',
    matchDate: '2023-10-23T11:00:00Z',
    avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Parc_Disneyland_Paris_logo.png/300px-Parc_Disneyland_Paris_logo.png',
  },
];

const CANDIDATE_MATCHES = [
  {
    id: '10',
    candidateName: 'Jean Dupont',
    desiredJobTitle: 'Serveur / Serveuse',
    contractType: 'Saisonnier',
    matchDate: '2023-10-26T09:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=jean.dupont',
  },
  {
    id: '11',
    candidateName: 'Marie Curie',
    desiredJobTitle: 'Cuisinier / Cuisinière',
    contractType: 'CDI',
    matchDate: '2023-10-24T18:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=marie.curie',
  },
  {
    id: '12',
    candidateName: 'Pierre Martin',
    desiredJobTitle: 'Plagiste',
    contractType: 'Saisonnier',
    matchDate: '2023-10-23T10:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=pierre.martin',
  },
];

// --- Helpers & Composants UI ---

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `Match le ${date.toLocaleDateString('fr-FR')}`;
};

const MatchCard = ({ item, isRecruiter }: { item: any, isRecruiter: boolean }) => {
  const title = isRecruiter ? item?.candidateName : item?.companyName;
  const subtitle = isRecruiter ? item?.desiredJobTitle : item?.jobTitle;
  const contract = item?.contractType;
  const avatarUrl = item?.avatarUrl;
  const matchDate = item?.matchDate;

  if (!title || !subtitle || !matchDate) {
    return null;
  }

  return (
    <View style={styles.card}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="contain" />
      <View style={styles.cardContent}>
        <Text style={styles.titleCard}>{title}</Text>
        <Text style={styles.subtitleCard}>{subtitle}</Text>
        {contract && <Text style={styles.contractType}>{contract}</Text>}
        <Text style={styles.date}>{formatDate(matchDate)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.light.textSecondary} />
    </View>
  );
};

// --- Écran Principal ---

export default function HistoricalScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const isRecruiter = !!user?.recruiterProfile;
  const matches = isRecruiter ? CANDIDATE_MATCHES : RECRUITER_MATCHES;
  const tabs = isRecruiter ? getRecruiterTabs(navigation) : getCandidateTabs(navigation);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique des Matchs</Text>
        <Text style={styles.subtitle}>
          {isRecruiter ? 'Retrouvez les candidats qui ont matché avec vos offres.' : 'Retrouvez les offres qui ont matché avec votre profil.'}
        </Text>
      </View>

      <FlatList
        data={matches}
        renderItem={({ item }) => <MatchCard item={item} isRecruiter={isRecruiter} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>Aucun match pour le moment.</Text>
          </View>
        )}
      />
      <BottomTabBar tabs={tabs} activeTabId="matches" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: Colors.light.backgroundCard,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4930a3',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  emptyCard: {
    marginHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  emptyCardText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardContent: {
    flex: 1,
  },
  titleCard: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitleCard: {
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  contractType: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 8,
  },
});
