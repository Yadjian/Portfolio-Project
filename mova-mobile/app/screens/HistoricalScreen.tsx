import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Colors from '../../constants/Colors';
import BottomTabBar from '../../components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '../../constants/tabsConfig';
import { getMatches } from '../../services/api';
import { updateMatchCount } from '@/lib/notificationStorage';
import { useNotifications } from '@/contexts/NotificationContext';

/**
 * HistoricalScreen
 *
 * This screen displays the match history for both candidates and recruiters.
 *
 * Main features:
 * - Shows a list of matches (job offers for candidates, candidates for recruiters).
 * - Fetches match data from the backend and displays it in a card list.
 * - Allows navigation to a detailed match view on card press.
 * - Shows a loading indicator while fetching data.
 * - Handles empty state if there are no matches.
 * - Displays a bottom tab bar for navigation.
 *
 * Key logic:
 * - Uses useFocusEffect to refresh matches every time the screen is focused.
 * - Maps backend match data to a UI-friendly format.
 * - Renders different views for candidates and recruiters.
 * - Handles navigation to MatchDetailScreen with the correct user type.
 */

// --- Types ---
// Match type for displaying match history cards
type Match = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  matchDate: string;
  avatarUrl: string;
  isNew?: boolean; // Nouveau : indique si le match n'a pas encore été consulté
};

// --- Helpers & UI Components ---
// Format the match date for display
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `Match le ${date.toLocaleDateString('fr-FR')}`;
};

// Card component for each match in the list
const MatchCard = ({ item, onPress }: { item: Match; onPress: () => void }) => {
  const { title, subtitle, meta, matchDate, avatarUrl, isNew } = item;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.card, isNew && styles.newMatchCard]}>
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NOUVEAU</Text>
          </View>
        )}
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

// --- Candidate View ---
// Displays the match history for candidates
const CandidateHistoryView = ({ navigation }: { navigation: any }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSeenCount, setLastSeenCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchMatches = async () => {
        try {
          setLoading(true);
          const data = await getMatches();
          
          // Récupérer le dernier compteur vu
          const lastCountStr = await SecureStore.getItemAsync('last_match_count');
          const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
          setLastSeenCount(lastCount);

          // Map backend data to Match type for the component
          const normalizedMatches: Match[] = data.map((match: any, index: number) => ({
            id: match.matchId,
            title: `${match.profile.firstName} ${match.profile.lastName}`,
            subtitle: match.profile.searchedJobTitle || 'Poste non spécifié',
            meta: '',
            matchDate: match.matchedAt,
            avatarUrl: `https://ui-avatars.com/api/?name=${match.profile.firstName}+${match.profile.lastName}&size=200&background=4930a3&color=fff`,
            isNew: index >= lastCount,
          }));

          setMatches(normalizedMatches);
          
          await updateMatchCount(normalizedMatches.length);
        } catch (error) {
          // Error fetching matches for candidate
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();
    }, [])
  );

  // Handle navigation to match detail
  const handleMatchPress = (matchId: string) => {
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

// --- Recruiter View ---
// Displays the match history for recruiters
const RecruiterHistoryView = ({ navigation }: { navigation: any }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSeenCount, setLastSeenCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const fetchMatches = async () => {
        try {
          setLoading(true);
          const data = await getMatches();
          
          const lastCountStr = await SecureStore.getItemAsync('last_match_count');
          const lastCount = lastCountStr ? parseInt(lastCountStr, 10) : 0;
          setLastSeenCount(lastCount);

          // Map backend data to Match type for the component
          const normalizedMatches: Match[] = data.map((match: any, index: number) => ({
            id: match.matchId,
            title: `${match.profile.firstName} ${match.profile.lastName}`,
            subtitle: match.profile.desiredJobTitle || 'Poste non spécifié',
            meta: match.profile.experienceLevel || '',
            matchDate: match.matchedAt,
            avatarUrl: match.profile.photoUrl || `https://ui-avatars.com/api/?name=${match.profile.firstName}+${match.profile.lastName}&size=200&background=4930a3&color=fff`,
            isNew: index >= lastCount,
          }));

          setMatches(normalizedMatches);
          
          await updateMatchCount(normalizedMatches.length);
        } catch (error) {
          // Error fetching matches for recruiter
        } finally {
          setLoading(false);
        }
      };

      fetchMatches();
    }, [])
  );

  // Handle navigation to match detail
  const handleMatchPress = (matchId: string) => {
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

// --- Main Screen ---
// Decides which view to display based on user type (candidate or recruiter)
export default function HistoricalScreen({ route }: { route: any }) {
  const navigation = useNavigation();
  const userType = route.params?.userType ?? 'candidate';
  const isRecruiter = userType === 'recruiter';
  
  // Get notification context
  const { profileBadgeCount, setMatchBadgeCount, refreshMatchBadge } = useNotifications();

  // Refresh badge when focus screen
  useFocusEffect(
    React.useCallback(() => {
      // Badge at 0 when historicalscreen
      setMatchBadgeCount(0);
      refreshMatchBadge();
    }, [setMatchBadgeCount, refreshMatchBadge])
  );

  // Get the correct tab configuration for the user type
  const tabs = isRecruiter ? getRecruiterTabs(navigation, profileBadgeCount) : getCandidateTabs(navigation, profileBadgeCount);
  
  // Update tabs to show 0 badge on matches tab (we're on this screen)
  const updatedTabs = tabs.map(tab =>
    tab.id === 'matches'
      ? { ...tab, badge: 0 } // Current screen, so no badge
      : tab
  );

  return (
    <View style={styles.container}>
      {isRecruiter ? (
        <RecruiterHistoryView navigation={navigation} />
      ) : (
        <CandidateHistoryView navigation={navigation} />
      )}
      {/* Bottom tab bar for navigation */}
      <BottomTabBar tabs={updatedTabs} activeTabId="matches" />
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
    position: 'relative',
  },
  newMatchCard: {
    backgroundColor: '#f0f4ff',
    borderColor: '#4930a3',
    borderWidth: 2,
    shadowColor: '#4930a3',
    shadowOpacity: 0.25,
  },
  newBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 10,
  },
  newBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
