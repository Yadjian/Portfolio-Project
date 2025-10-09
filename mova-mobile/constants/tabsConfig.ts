import { AuthStackParamList } from '../lib/types';

export const getCandidateTabs = (navigation: any, notificationCount: number = 0) => [
  {
    id: 'profile',
    label: 'Mon Profil',
    iconName: 'card-outline',
    iconNameActive: 'card',
    onPress: () => navigation.navigate('CandidateProfile'),
  },
  {
    id: 'cv',
    label: 'Mon CV',
    iconName: 'document-text-outline',
    iconNameActive: 'document-text',
    onPress: () => navigation.navigate('EditProfileScreen', { userType: 'candidat' }),
  },
  {
    id: 'matches',
    label: 'Matchs',
    iconName: 'heart-outline',
    iconNameActive: 'heart',
    onPress: () => {},
  },
  {
    id: 'notifications',
    label: 'Notifications',
    iconName: 'notifications-outline',
    iconNameActive: 'notifications',
    badge: notificationCount,
    onPress: () => navigation.navigate('SwipeNotification', { userType: 'candidat' }),
  },
];

export const getRecruiterTabs = (navigation: any, notificationCount: number = 0) => [
  {
    id: 'profile',
    label: 'Mon Profil',
    iconName: 'card-outline',
    iconNameActive: 'card',
    onPress: () => navigation.navigate('RecruiterProfile'),
  },
  {
    id: 'offre',
    label: 'Mon Offre',
    iconName: 'document-text-outline',
    iconNameActive: 'document-text',
    onPress: () => navigation.navigate('EditProfileScreen', { userType: 'recruteur' }),
  },
  {
    id: 'matches',
    label: 'Matchs',
    iconName: 'heart-outline',
    iconNameActive: 'heart',
    onPress: () => {},
  },
  {
    id: 'notifications',
    label: 'Notifications',
    iconName: 'notifications-outline',
    iconNameActive: 'notifications',
    badge: notificationCount,
    onPress: () => navigation.navigate('SwipeNotification', { userType: 'recruteur' }),
  },
];