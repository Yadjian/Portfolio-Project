import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RecruiterCardProps {
  avatarUrl: string;
  firstName: string;
  lastName: string;
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
  if (!text.trim()) return ['', '', ''];

  let charsPerLine;
  if (screenWidth <= 350) charsPerLine = 35;
  else if (screenWidth <= 400) charsPerLine = 40;
  else if (screenWidth <= 450) charsPerLine = 45;
  else charsPerLine = 50;

  const words = text.trim().split(' ');
  const result = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    if ((currentLine.length + words[i].length + (currentLine ? 1 : 0)) <= charsPerLine) {
      currentLine += (currentLine ? ' ' : '') + words[i];
    } else {
      result.push(currentLine);
      currentLine = words[i];
      if (result.length === 2) break;
    }
  }
  if (currentLine) result.push(currentLine);

  while (result.length < 3) result.push('');
  return result.slice(0, 3);
}

export default function RecruiterCard({ 
  avatarUrl, 
  firstName,
  lastName,
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
  const photoWidth = width * 0.26;
  const photoHeight = photoWidth * 1.2;
  const cardPadding = width * 0.03;
  const nameFontSize = width * 0.055;
  const companyFontSize = width * 0.045;
  const infoFontSize = width * 0.042;
  const presentationFontSize = width * 0.042;
  const lineHeight = height * 0.035;

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
    companyName: {
      fontSize: companyFontSize,
      color: '#6746a8',
      fontWeight: '700' as const,
      marginBottom: 4,
    },
    location: {
      fontSize: infoFontSize,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    jobSeeking: {
      fontSize: infoFontSize,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    experienceRequired: {
      fontSize: infoFontSize,
      color: '#333',
      fontWeight: '600' as const,
      marginBottom: 4,
    },
    contractType: {
      fontSize: infoFontSize,
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
      lineHeight: presentationFontSize * 1.5,
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
          <Text style={dynamicStyles.companyName}>{companyName}</Text>
          {location && <Text style={dynamicStyles.location}>{location}</Text>}
          <Text style={dynamicStyles.jobSeeking}>{jobSeeking}</Text>
          <Text style={dynamicStyles.experienceRequired}>Expérience: {experienceRequired}</Text>
          <Text style={dynamicStyles.contractType}>Contrat: {contractType}</Text>
        </View>
      </View>

      {/* Section basse : 3 lignes fixes avec séparateur */}
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