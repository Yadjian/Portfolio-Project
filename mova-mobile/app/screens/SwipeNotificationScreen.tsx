import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import CandidateCard from '@/components/ui/CandidateCard';
import RecruiterCard from '@/components/ui/RecruiterCard';

export default function SwipeNotificationScreen({ route }: any) {
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
          presentation: 'Nous recherchons un développeur motivé à Paris.',
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
          presentation: 'Débutant passionné par le front-end.',
          avatarUrl: '',
        },
      ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts géolocalisés</Text>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          userType === 'candidat' ? (
            <RecruiterCard
              companyName={item.companyName}
              location={item.location}
              jobSeeking={item.jobSeeking}
              experienceRequired={item.experienceRequired}
              contractType={item.contractType}
              presentation={item.presentation}
              avatarUrl={item.avatarUrl}
            />
          ) : (
            <CandidateCard
              firstName={item.firstName}
              lastName={item.lastName}
              location={item.location}
              job={item.job}
              experience={item.experience}
              contractType={item.contractType}
              presentation={item.presentation}
              avatarUrl={item.avatarUrl}
            />
          )
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6746a8',
    textAlign: 'center',
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
});