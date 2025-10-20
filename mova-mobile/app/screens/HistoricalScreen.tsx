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
    id: '4',
    companyName: 'Zara',
    jobTitle: 'Vendeur / Vendeuse',
    contractType: 'CDD',
    matchDate: '2023-10-25T18:00:00Z',
    avatarUrl: 'https://logo.clearbit.com/zara.com',
  },
  {
    id: '8',
    companyName: 'Nike',
    jobTitle: 'Vendeur / Vendeuse',
    contractType: 'CDI',
    matchDate: '2023-10-21T17:00:00Z',
    avatarUrl: 'https://logo.clearbit.com/nike.com',
  },
  {
    id: '16',
    companyName: 'Sephora',
    jobTitle: 'Vendeur / Vendeuse',
    contractType: 'CDI',
    matchDate: '2023-10-20T11:00:00Z',
    avatarUrl: 'https://logo.clearbit.com/sephora.com',
  },
  {
    id: '17',
    companyName: 'Fnac',
    jobTitle: 'Vendeur / Vendeuse',
    contractType: 'CDD',
    matchDate: '2023-10-19T13:00:00Z',
    avatarUrl: 'https://logo.clearbit.com/fnac.com',
  },
  {
    id: '18',
    companyName: 'Decathlon',
    jobTitle: 'Vendeur / Vendeuse',
    contractType: 'CDI',
    matchDate: '2023-10-18T10:00:00Z',
    avatarUrl: 'https://logo.clearbit.com/decathlon.com',
  },
  {
    id: '19',
    companyName: 'Carrefour',
    jobTitle: 'Vendeur / Vendeuse',
    contractType: 'CDI',
    matchDate: '2023-10-17T16:00:00Z',
    avatarUrl: 'https://logo.clearbit.com/carrefour.com',
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

// Ce composant reçoit maintenant un objet avec une structure de données unifiée
const MatchCard = ({ item }: { item: any }) => {
  const { title, subtitle, contractType, matchDate, avatarUrl } = item;

  return (
    <View style={styles.card}>
      <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="contain" />
      <View style={styles.cardContent}>
        <Text style={styles.titleCard}>{title}</Text>
        <Text style={styles.subtitleCard}>{subtitle}</Text>
        <Text style={styles.metaInfo}>
          {contractType ? `${contractType} | ` : ''}{formatDate(matchDate)}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={Colors.light.textSecondary} />
    </View>
  );
};

// --- Écran Principal ---

export default function HistoricalScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  
  // NOTE: La logique est temporairement inversée pour corriger un bug de détection de rôle
  const isRecruiter = !!user?.recruiterProfile;
  
  // Un recruteur devrait voir CANDIDATE_MATCHES. Comme isRecruiter est faussement `false`, on inverse la condition.
  const rawMatches = !isRecruiter ? CANDIDATE_MATCHES : RECRUITER_MATCHES;

  // On normalise les données pour que chaque objet ait la même forme
  const normalizedMatches = rawMatches.map(match => {
    // La condition ici doit aussi être inversée pour correspondre à la logique ci-dessus
    if (!isRecruiter) { // L'utilisateur est un recruteur (mais détecté comme candidat)
      return {
        id: match.id,
        title: match.candidateName,
        subtitle: match.desiredJobTitle,
        contractType: match.contractType,
        matchDate: match.matchDate,
        avatarUrl: match.avatarUrl,
      };
    } else { // L'utilisateur est un candidat
      return {
        id: match.id,
        title: match.companyName,
        subtitle: match.jobTitle,
        contractType: match.contractType,
        matchDate: match.matchDate,
        avatarUrl: match.avatarUrl,
      };
    }
  });

  const tabs = !isRecruiter ? getRecruiterTabs(navigation) : getCandidateTabs(navigation);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique des Matchs</Text>
        <Text style={styles.subtitle}>
          {isRecruiter ? 'Retrouvez les offres qui ont matché avec votre profil.' : 'Retrouvez les candidats qui ont matché avec vos offres.'}
        </Text>
      </View>

      <FlatList
        data={normalizedMatches} // On utilise les données normalisées
        renderItem={({ item }) => <MatchCard item={item} />}
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
    marginBottom: 8,
  },
  metaInfo: {
    fontSize: 12,
    color: '#aaa',
  },
});
