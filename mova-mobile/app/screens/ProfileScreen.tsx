import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image, Pressable } from 'react-native';
import GradientBackground from '@/components/ui/ColorBackground';
import WhiteCard from '@/components/ui/WhiteCard';

export default function ProfileScreen() {
  const { width, height } = useWindowDimensions();

  // --- Données utilisateur dynamiques (à remplacer par les vraies données d'Auth0) ---
  const user = {
    name: 'Lucas Dupont',
    email: 'lucas.d@email.com',
    role: 'candidat', // Change 'candidat' en 'recruteur' pour voir la différence
    avatarUrl: 'https://placehold.co/100x100/6746a8/FFF?text=LD', // URL de l'avatar
  };
  // ------------------------------------------------------------------------------------

  const handleCVAccess = () => {
    console.log("Accès au CV sur R2 Storage...");
    // Logique pour télécharger/afficher le CV
  };

  const handleOffersAccess = () => {
    console.log("Accès aux offres sur R2 Storage...");
    // Logique pour afficher les offres
  };

  // Styles dynamiques
  const cardWidth = width * 0.9;
  const avatarSize = width * 0.25;
  const titleFontSize = width * 0.06;
  const detailFontSize = width * 0.04;
  const buttonWidth = cardWidth * 0.8;
  const buttonPaddingVertical = height * 0.02;

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, { fontSize: width * 0.08 }]}>Mon Profil</Text>

        {/* Carte d'identité */}
        <WhiteCard style={{ width: cardWidth, height: 'auto', paddingVertical: height * 0.04 }}>
          <View style={styles.cardContent}>
            <Image
              source={{ uri: user.avatarUrl }}
              style={{
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                marginBottom: height * 0.02,
              }}
            />
            <Text style={[styles.userName, { fontSize: titleFontSize }]}>{user.name}</Text>
            <Text style={[styles.userEmail, { fontSize: detailFontSize }]}>{user.email}</Text>

            {/* Bouton d'action dynamique basé sur le rôle */}
            {user.role === 'candidat' ? (
              <Pressable
                style={[styles.actionButton, { width: buttonWidth, paddingVertical: buttonPaddingVertical, backgroundColor: '#07b9ff' }]}
                onPress={handleCVAccess}
              >
                <Text style={styles.buttonText}>Voir mon CV</Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.actionButton, { width: buttonWidth, paddingVertical: buttonPaddingVertical, backgroundColor: '#6b25f9' }]}
                onPress={handleOffersAccess}
              >
                <Text style={styles.buttonText}>Gérer mes offres</Text>
              </Pressable>
            )}
          </View>
        </WhiteCard>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    top: '10%',
    alignSelf: 'center',
  },
  cardContent: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  userEmail: {
    color: '#666',
    marginBottom: '10%',
  },
  actionButton: {
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});