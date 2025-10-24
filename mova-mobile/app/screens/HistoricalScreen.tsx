import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '../../constants/tabsConfig';
import { getMatches } from '../../services/api';

// --- Types ---
type Match = {
  id: string;
  title: string;
  subtitle: string;
  meta: string; // Champ générique pour contrat ou expérience
  matchDate: string;
  avatarUrl: string;
};

// --- Helpers & Composants UI ---

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `Match le ${date.toLocaleDateString('fr-FR')}`;
};

const MatchCard = ({ item, onPress }: { item: Match; onPress: () => void }) => {
  const { title, subtitle, meta, matchDate, avatarUrl } = item;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={styles.card}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="contain" />
        <View style={styles.cardContent}>
          <Text style={styles.titleCard}>{title}</Text>
          <Text style={styles.subtitleCard}>{subtitle}</Text>
          {meta && <Text style={styles.metaInfo}>{meta}</Text>}
          <Text style={styles.dateInfo}>{formatDate(matchDate)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.light.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

// --- VUE POUR LE CANDIDAT ---
const CandidateHistoryView = ({ navigation }: { navigation: any }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchMatches = async () => {
        try {
          setLoading(true);
          const data = await getMatches();
          console.log('Matches data:', data);

          // Mapper les données du backend vers le format du composant
          const normalizedMatches: Match[] = data.map((match: any) => ({
            id: match.matchId,
            title: `${match.profile.firstName} ${match.profile.lastName}`, // Nom et prénom du recruteur
            subtitle: match.profile.searchedJobTitle || 'Poste non spécifié', // Poste recherché
            meta: '', // Pas de meta pour les candidats
            matchDate: match.matchedAt,
            avatarUrl: `https://ui-avatars.com/api/?name=${match.profile.firstName}+${match.profile.lastName}&size=200&background=4930a3&color=fff`,
          }));

          setMatches(normalizedMatches);
        } catch (error) {
          console.error('Erreur lors de la récupération des matchs:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();
    }, [])
  );

  const handleMatchPress = (matchId: string) => {
    console.log('Match clicked:', matchId);
    navigation.navigate('MatchDetail', { matchId, userType: 'candidate' });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Historique des Matchs</Text>
        <Text style={styles.subtitle}>Retrouvez les offres qui ont matché avec votre profil.</Text>
      </View>
      <FlatList
        data={matches}
        renderItem={({ item }) => <MatchCard item={item} onPress={() => handleMatchPress(item.id)} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyCard}><Text style={styles.emptyCardText}>Aucun match pour le moment.</Text></View>
        )}
      />
    </>
  );
};

// --- VUE POUR LE RECRUTEUR ---
const RecruiterHistoryView = ({ navigation }: { navigation: any }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchMatches = async () => {
        try {
          setLoading(true);
          const data = await getMatches();
          console.log('Matches data:', data);

          // Mapper les données du backend vers le format du composant
          const normalizedMatches: Match[] = data.map((match: any) => ({
            id: match.matchId,
            title: `${match.profile.firstName} ${match.profile.lastName}`, // Prénom et nom
            subtitle: match.profile.desiredJobTitle || 'Poste non spécifié', // Poste
            meta: match.profile.experienceLevel || '', // Expérience
            matchDate: match.matchedAt,
            avatarUrl: match.profile.photoUrl || `https://ui-avatars.com/api/?name=${match.profile.firstName}+${match.profile.lastName}&size=200&background=4930a3&color=fff`,
          }));

          setMatches(normalizedMatches);
        } catch (error) {
          console.error('Erreur lors de la récupération des matchs:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();
    }, [])
  );

  const handleMatchPress = (matchId: string) => {
    console.log('Match clicked:', matchId);
    navigation.navigate('MatchDetail', { matchId, userType: 'recruiter' });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Historique des Matchs</Text>
        <Text style={styles.subtitle}>Retrouvez les candidats qui ont matché avec vos offres.</Text>
      </View>
      <FlatList
        data={matches}
        renderItem={({ item }) => <MatchCard item={item} onPress={() => handleMatchPress(item.id)} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={() => (
          <View style={styles.emptyCard}><Text style={styles.emptyCardText}>Aucun match pour le moment.</Text></View>
        )}
      />
    </>
  );
};

// --- Écran Principal (qui choisit quelle vue afficher) ---
export default function HistoricalScreen({ route }: { route: any }) {
  const navigation = useNavigation();
  const userType = route.params?.userType ?? 'candidate';
  const isRecruiter = userType === 'recruiter';

  const tabs = isRecruiter ? getRecruiterTabs(navigation) : getCandidateTabs(navigation);

  return (
    <View style={styles.container}>
      {isRecruiter ? <RecruiterHistoryView navigation={navigation} /> : <CandidateHistoryView navigation={navigation} />}
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#4930a3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#f8f8f8',
    borderWidth: 2,
    borderColor: '#4930a3',
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
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  dateInfo: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
});
