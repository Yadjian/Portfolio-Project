import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CandidateCard from '@/components/ui/CandidateCard';
import RecruiterCard from '@/components/ui/RecruiterCard';
import BottomTabBar from '@/components/ui/BottomTabBar';
import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';
import SmallMovaLogo from '@/components/ui/SmallMovaLogo';

export default function SwipeNotificationScreen({ route }: any) {
  const navigation = useNavigation();
  // Récupère le type d'utilisateur (à passer dans la navigation)
  const userType = route?.params?.userType ?? 'candidat'; // 'candidat' ou 'recruteur'

  // Les contacts sont typés en any pour FlatList
  const contacts: any[] = userType === 'candidat'
    ? [
        {
          id: '1',
          companyName: 'TechCorp Solutions',
          location: 'Paris',
          jobSeeking: 'Développeur React',
          experienceRequired: 'Intermédiaire',
          contractType: 'CDI',
          presentation: 'Nous recherchons un développeur passionné pour rejoindre notre équipe dynamique et travailler sur des projets innovants dans un environnement stimulant.',
          avatarUrl: '',
        },
      ]
    : [
        {
          id: '1',
          firstName: 'Lucas',
          lastName: 'Boyadjian',
          location: 'Paris',
          job: 'Développeur Front-end',
          experience: 'Débutant',
          contractType: 'CDI',
          presentation: 'Développeur front-end débutant mais motivé, passionné par React Native et prêt à apprendre et contribuer à des projets ambitieux avec une équipe expérimentée.',
          avatarUrl: '',
        },
      ];

  const tabs = userType === 'candidat'
    ? getCandidateTabs(navigation, 0)
    : getRecruiterTabs(navigation, 0);

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <SmallMovaLogo />
      </View>
      <Text style={styles.title}>Faites votre choix</Text>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          userType === 'candidat' ? (
            <RecruiterCard
              companyName={item.companyName ?? ''}
              location={item.location ?? ''}
              jobSeeking={item.jobSeeking ?? ''}
              experienceRequired={item.experienceRequired ?? ''}
              contractType={item.contractType ?? ''}
              presentation={item.presentation ?? ''}
              avatarUrl={item.avatarUrl ?? ''}
            />
          ) : (
            <CandidateCard
              firstName={item.firstName ?? ''}
              lastName={item.lastName ?? ''}
              location={item.location ?? ''}
              job={item.job ?? ''}
              experience={item.experience ?? ''}
              contractType={item.contractType ?? ''}
              presentation={item.presentation ?? ''}
              avatarUrl={item.avatarUrl ?? ''}
            />
          )
        }
        contentContainerStyle={styles.list}
      />
      <BottomTabBar tabs={tabs} activeTabId="notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2', // gris clair
  },
  logoRow: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6746a8',
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 24,
    paddingHorizontal: 10,
  },
});