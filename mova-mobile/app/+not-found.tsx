import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

/**
 * NotFoundScreen (+not-found.tsx)
 *
 * This file defines the "404 Not Found" screen for Expo Router.
 *
 * Main features:
 * - Displays a user-friendly message when a route does not exist.
 * - Provides a link to return to the home screen.
 * - Sets the screen title to "Oops!".
 *
 * Key logic:
 * - Used automatically by Expo Router when a route is not found.
 * - Works for both web and mobile navigation.
 */

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
