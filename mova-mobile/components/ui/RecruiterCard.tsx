import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RecruiterCardProps {
  avatarUrl: string;
  companyName: string;
  location?: string;
  jobSeeking?: string;
  experienceRequired?: string;
  contractType?: string;
  presentation?: string;
  style?: ViewStyle;
}

// Découpe le texte pour utiliser TOUTE LA LARGEUR de l'ID card
function splitPresentation(text: string, screenWidth: number): string[] {
  if (!text) return ['', '', ''];
  
  // Calcul de l'espace réellement disponible avec la nouvelle structure gradient
  const gradientBorderWidth = screenWidth * 0.9;
  const gradientPadding = 2;
  const cardPadding = screenWidth * 0.03;
  const textPadding = 8 + 2; // paddingRight + paddingLeft du presentationText
  const availableTextWidth = gradientBorderWidth - (2 * gradientPadding) - (2 * cardPadding) - textPadding;
  
  // Estimation des caractères par ligne basée sur la largeur disponible
  let maxCharsPerLine = Math.floor(availableTextWidth / (screenWidth * 0.02)); // Approximation basée sur la taille de police
  
  // Ajustements fins selon la taille d'écran
  if (screenWidth <= 350) maxCharsPerLine = Math.max(35, maxCharsPerLine);
  else if (screenWidth <= 400) maxCharsPerLine = Math.max(40, maxCharsPerLine);
  else if (screenWidth <= 450) maxCharsPerLine = Math.max(45, maxCharsPerLine);
  else maxCharsPerLine = Math.max(50, maxCharsPerLine);
  
  const words = text.split(' ');
  const lines: string[] = ['', '', ''];
  let currentLineIndex = 0;
  for (const word of words) {
    if (currentLineIndex >= 3) break;
    const testLine = lines[currentLineIndex] ? `${lines[currentLineIndex]} ${word}` : word;
    if (testLine.length <= maxCharsPerLine) {
      lines[currentLineIndex] = testLine;
    } else {
      currentLineIndex++;
      if (currentLineIndex < 3) {
        lines[currentLineIndex] = word;
      }
    }
  }
  return lines;
}

export default function RecruiterCard({ 
  avatarUrl, 
  companyName,
  location = "",
  jobSeeking = "Poste à pourvoir",
  experienceRequired = "Débutant",
  contractType = "CDI",
  presentation = "",
  style 
}: RecruiterCardProps) {
  const { width, height } = useWindowDimensions();
  const lines = splitPresentation(presentation, width);

  // Tailles dynamiques
  const cardPadding = width * 0.03;
  const borderRadius = 12;
  const borderWidth = 2;
  const gradientPadding = 2;

  const dynamicStyles = {
    gradientBorder: {
      width: width * 0.9,
      alignSelf: 'center' as const,
      borderRadius: borderRadius + borderWidth,
      padding: gradientPadding,
      marginVertical: height * 0.012,
    },
    container: {
      backgroundColor: '#fff',
      borderRadius: borderRadius,
      padding: cardPadding,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 6,
      flex: 1,
    },
    topSection: {
      flexDirection: 'row' as const,
      marginBottom: 0,
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
      width: width * 0.31,
      height: width * 0.31 * 1.2,
      borderRadius: 8,
      backgroundColor: '#f8f9fa',
    },
    mainInfo: {
      flex: 1,
      justifyContent: 'flex-start' as const,
      paddingTop: 4,
    },
    name: {
      fontSize: width * 0.055,
      fontWeight: '700' as const,
      color: '#1a1a1a',
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    location: {
      fontSize: width * 0.042,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    jobSeeking: {
      fontSize: width * 0.042,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    experienceRequired: {
      fontSize: width * 0.042,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    contractType: {
      fontSize: width * 0.042,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    detailsSection: {
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      paddingTop: height * 0.015,
    },
    lineContainer: {
      marginBottom: height * 0.008,
      position: 'relative' as const,
      minHeight: height * 0.035,
      justifyContent: 'center' as const,
    },
    presentationText: {
      fontSize: width * 0.042,
      color: '#333',
      textAlign: 'left' as const,
      fontWeight: '500' as const,
      paddingRight: width * 0.05,
      paddingLeft: 2,
      backgroundColor: 'transparent',
      zIndex: 2,
      lineHeight: width * 0.042 * 1.5,
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
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={dynamicStyles.gradientBorder}
    >
      <View style={[dynamicStyles.container, style || {}]}>
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
            <Text style={dynamicStyles.name}>{companyName}</Text>
            {location && <Text style={dynamicStyles.location}>{location}</Text>}
            <Text style={dynamicStyles.jobSeeking}>{jobSeeking}</Text>
            <Text style={dynamicStyles.experienceRequired}>{experienceRequired}</Text>
            <Text style={dynamicStyles.contractType}>{contractType}</Text>
          </View>
        </View>
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
    </LinearGradient>
  );
}