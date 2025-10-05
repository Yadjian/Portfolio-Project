import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface IdentityCardProps {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  location?: string;
  job?: string;
  experience?: string;
  contractType?: string; // Ajouté pour CDD, CDI, Stage, Alternance
  presentation?: string;
  style?: ViewStyle;
}

// Découpe le texte pour utiliser TOUTE LA LARGEUR de l'ID card
function splitPresentation(text: string, screenWidth: number): string[] {
  if (!text) return ['', '', '']; // 3 lignes vides si pas de texte
  
  // Calcul OPTIMISÉ pour lignes bien remplies sur 3 lignes
  const cardWidth = screenWidth * 0.9;
  const cardPadding = screenWidth * 0.03;
  const availableWidth = cardWidth - cardPadding;
  
  // Valeurs RÉDUITES pour éviter le débordement et le chevauchement
  let maxCharsPerLine = 35; // Réduit pour éviter débordement
  if (screenWidth > 350) maxCharsPerLine = 40; // Écran moyen réduit
  if (screenWidth > 400) maxCharsPerLine = 45; // Grand écran réduit  
  if (screenWidth > 450) maxCharsPerLine = 50; // Très grand écran réduit
  
  const words = text.split(' ');
  const lines: string[] = ['', '', ''];
  let currentLineIndex = 0;
  
  for (const word of words) {
    if (currentLineIndex >= 3) break; // Max 3 lignes
    
    const testLine = lines[currentLineIndex] ? `${lines[currentLineIndex]} ${word}` : word;
    
    if (testLine.length <= maxCharsPerLine) {
      lines[currentLineIndex] = testLine;
    } else {
      // Passer à la ligne suivante
      currentLineIndex++;
      if (currentLineIndex < 3) {
        lines[currentLineIndex] = word;
      }
    }
  }
  
  return lines; // Toujours 3 lignes
}

export default function IdentityCard({ 
  avatarUrl, 
  firstName,
  lastName,
  location,
  job = "Développeur React Native",
  experience = "Intermédiaire",
  contractType = "CDI",
  presentation = "",
  style 
}: IdentityCardProps) {
  const { width, height } = useWindowDimensions();
  const lines = splitPresentation(presentation, width);

  // Tailles dynamiques basées sur la largeur d'écran
  const photoWidth = width * 0.32; // ENCORE PLUS GRANDE : de 0.28 à 0.32
  const photoHeight = photoWidth * 1.25; // Ratio légèrement plus grand aussi
  const nameFontSize = width * 0.055; // Agrandi de 0.048 à 0.055
  const jobFontSize = width * 0.045; // Agrandi de 0.038 à 0.045
  const experienceFontSize = width * 0.042; // Agrandi de 0.035 à 0.042
  const presentationFontSize = width * 0.044; // Agrandi de 0.037 à 0.044
  const cardPadding = width * 0.03;
  const lineHeight = height * 0.045; // Espacement normal

  const dynamicStyles = {
    container: {
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: cardPadding,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 6,
      marginVertical: height * 0.012,
      borderWidth: 1,
      borderColor: '#f0f0f0',
      width: '90%' as const,
      alignSelf: 'center' as const,
    },
    topSection: {
      flexDirection: 'row' as const,
      marginBottom: 0, // SUPPRIMÉ : Aucun espace sous la photo
    },
    photoGradientBorder: {
      borderRadius: 10,
      padding: 1,
      marginRight: width * 0.04,
    },
    photoContainer: {
      borderRadius: 8,
      overflow: 'hidden' as const,
    },
    photo: {
      width: photoWidth,
      height: photoHeight,
      borderRadius: 8,
      backgroundColor: '#f8f9fa',
    },
    mainInfo: {
      flex: 1,
      justifyContent: 'flex-start' as const,
      paddingTop: 4,
    },
    name: {
      fontSize: nameFontSize,
      fontWeight: '700' as const,
      color: '#1a1a1a',
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    location: {
      fontSize: experienceFontSize,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    job: {
      fontSize: experienceFontSize,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    experience: {
      fontSize: experienceFontSize,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    contractType: {
      fontSize: experienceFontSize,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    detailsSection: {
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      paddingTop: height * 0.005, // ULTRA RÉDUIT : Presque pas d'espace
    },
    lineContainer: {
      marginBottom: height * 0.015, // Espacement normal
      position: 'relative' as const,
      minHeight: lineHeight,
      justifyContent: 'center' as const,
    },
    presentationText: {
      fontSize: presentationFontSize,
      color: '#333',
      textAlign: 'left' as const,
      fontWeight: '500' as const,
      paddingRight: 8,
      paddingLeft: 2,
      backgroundColor: 'transparent',
      zIndex: 2,
      lineHeight: presentationFontSize * 1.5, // Augmenté l'interligne du texte
    },
    separator: {
      position: 'absolute' as const,
      left: 0,
      right: 0,
      bottom: 4,
      height: 1,
      backgroundColor: '#d1d5db',
      zIndex: 1,
      borderRadius: 1,
    },
  };

  return (
    <View style={[dynamicStyles.container, style]}>
      <View style={dynamicStyles.topSection}>
        <LinearGradient
          colors={['#6746a8', '#6b25f9', '#07b9ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={dynamicStyles.photoGradientBorder}
        >
          <View style={dynamicStyles.photoContainer}>
            <Image source={{ uri: avatarUrl }} style={dynamicStyles.photo} />
          </View>
        </LinearGradient>
        <View style={dynamicStyles.mainInfo}>
          <Text style={dynamicStyles.name}>{firstName} {lastName}</Text>
          {location && <Text style={dynamicStyles.location}>{location}</Text>}
          <Text style={dynamicStyles.job}>{job}</Text>
          <Text style={dynamicStyles.experience}>Expérience: {experience}</Text>
          <Text style={dynamicStyles.contractType}>Contrat: {contractType}</Text>
        </View>
      </View>

      {/* Section basse : EXACTEMENT 3 lignes avec séparateurs */}
      <View style={dynamicStyles.detailsSection}>
        <View style={dynamicStyles.lineContainer}>
          <Text style={dynamicStyles.presentationText}>{lines[0] || ' '}</Text>
          <View style={dynamicStyles.separator} />
        </View>
        <View style={dynamicStyles.lineContainer}>
          <Text style={dynamicStyles.presentationText}>{lines[1] || ' '}</Text>
          <View style={dynamicStyles.separator} />
        </View>
        <View style={dynamicStyles.lineContainer}>
          <Text style={dynamicStyles.presentationText}>{lines[2] || ' '}</Text>
          <View style={dynamicStyles.separator} />
        </View>
      </View>
    </View>
  );
}