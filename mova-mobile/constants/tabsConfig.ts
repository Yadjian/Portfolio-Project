/**
 * tabsConfig.ts
 *
 * Centralizes the configuration for bottom tab navigation for both candidates and recruiters.
 *
 * Main features:
 * - Exports functions to generate tab definitions for each user type.
 * - Each tab includes id, label, icon names, navigation handler, and optional badge.
 * - Makes it easy to update tab structure or icons in one place.
 *
 * Usage:
 *   import { getCandidateTabs, getRecruiterTabs } from '@/constants/tabsConfig';
 *   const tabs = getCandidateTabs(navigation, notificationCount);
 */

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
    onPress: () => navigation.navigate('CandidateCVScreen'),
  },
  {
    id: 'matches',
    label: 'Matchs',
    iconName: 'heart-outline',
    iconNameActive: 'heart',
    onPress: () => navigation.navigate('HistoricalScreen'),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    iconName: 'notifications-outline',
    iconNameActive: 'notifications',
    badge: notificationCount,
    onPress: () => navigation.navigate('SwipeNotification', { userType: 'candidate' }),
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
    onPress: () => navigation.navigate('RecruiterJobOfferScreen'),
  },
  {
    id: 'matches',
    label: 'Matchs',
    iconName: 'heart-outline',
    iconNameActive: 'heart',
    onPress: () => navigation.navigate('HistoricalScreen', { userType: 'recruiter' }),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    iconName: 'notifications-outline',
    iconNameActive: 'notifications',
    badge: notificationCount,
    onPress: () => navigation.navigate('SwipeNotification', { userType: 'recruiter' }),
  },
];
