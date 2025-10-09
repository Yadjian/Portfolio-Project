import React from 'react';
import { View, Text, Image, ViewStyle, TextInput, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CandidateCardProps {
  avatarUrl: string;
  firstName: string;
  lastName: string;
  location?: string;
  job?: string;
  experience?: string;
  contractType?: string;
  presentation?: string;
  style?: ViewStyle;
  isEditing?: boolean;
  onFieldChange?: (field: string, value: string) => void;
  onImagePicker?: () => void;
}

function splitPresentation(text: string, screenWidth: number): string[] {
  if (!text) return ['', '', ''];
  let maxCharsPerLine = 35;
  if (screenWidth > 350) maxCharsPerLine = 40;
  if (screenWidth > 400) maxCharsPerLine = 45;
  if (screenWidth > 450) maxCharsPerLine = 50;
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

export default function CandidateCard({
  avatarUrl,
  firstName,
  lastName,
  location,
  job = "Développeur React Native",
  experience = "Intermédiaire",
  contractType = "CDI",
  presentation = "",
  style: customStyle,
  isEditing = false,
  onFieldChange,
  onImagePicker,
}: CandidateCardProps) {
  const { width, height } = useWindowDimensions();
  const lines = splitPresentation(presentation, width);

  const cardPadding = width * 0.03;
  const borderRadius = 12;
  const borderWidth = 2;
  const gradientPadding = 2;
  const photoWidth = width * 0.31;
  const photoHeight = photoWidth * 1.2;

  const dynamicStyles = StyleSheet.create({
    gradientBorder: {
      width: width * 0.9,
      alignSelf: 'center',
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
      flexDirection: 'row',
      marginBottom: 0,
      alignItems: 'flex-start',
    },
    photoGradientBorder: {
      borderRadius: 10,
      padding: 1,
      marginRight: width * 0.04,
    },
    photoContainer: {
      width: photoWidth,
      height: photoHeight,
      borderRadius: 8,
      overflow: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,                // <-- bordure toujours visible
      borderColor: '#6746a8',        // <-- couleur violette
      borderStyle: 'solid',          // <-- style plein
      backgroundColor: '#f8f9fa',
    },
    photo: {
      width: photoWidth,
      height: photoHeight,
      borderRadius: 8,
      backgroundColor: '#f8f9fa',
    },
    mainInfo: {
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: 4,
    },
    name: {
      fontSize: width * 0.055,
      color: '#1a1a1a',
      marginBottom: 4,
      letterSpacing: -0.3,
    },
    location: {
      fontSize: width * 0.042,
      color: '#333',
      marginBottom: 4,
    },
    job: {
      fontSize: width * 0.042,
      color: '#333',
      marginBottom: 4,
    },
    experience: {
      fontSize: width * 0.042,
      color: '#333',
      marginBottom: 4,
    },
    contractType: {
      fontSize: width * 0.042,
      color: '#333',
      marginBottom: 4,
    },
    detailsSection: {
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0',
      paddingTop: height * 0.015,
    },
    lineContainer: {
      marginBottom: height * 0.008,
      position: 'relative',
      minHeight: height * 0.035,
      justifyContent: 'center',
    },
    presentationText: {
      fontSize: width * 0.042,
      color: '#333',
      textAlign: 'left',
      paddingRight: 8,
      paddingLeft: 2,
      backgroundColor: 'transparent',
      zIndex: 2,
      lineHeight: width * 0.042 * 1.5,
    },
    separator: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 4,
      height: 1,
      backgroundColor: '#d1d5db',
      zIndex: 1,
      borderRadius: 1,
    },
    editableField: {
      borderWidth: 0,
      backgroundColor: 'transparent',
      color: '#1a1a1a',
      marginBottom: 0,
      padding: 0,
      fontSize: width * 0.042,
      textAlign: 'left',
    },
    photoEditOverlay: {
      position: 'absolute',
      bottom: 8,
      right: 8,
      backgroundColor: '#6746a8',
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    photoEditText: {
      color: '#fff',
      fontSize: 18,
    },
  });

  // Bordure dynamique pour la photo en édition
  const photoContainerStyle = [
    dynamicStyles.photoContainer,
    isEditing ? {
      borderWidth: 2,
      borderColor: '#6746a8',
      borderStyle: 'dashed',
    } as ViewStyle : null,
  ].filter(Boolean);

  return (
    <LinearGradient
      colors={['#6746a8', '#6b25f9', '#07b9ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={dynamicStyles.gradientBorder}
    >
      <View style={[dynamicStyles.container, customStyle || {}]}>
        <View style={dynamicStyles.topSection}>
          <LinearGradient
            colors={['#6746a8', '#6b25f9', '#07b9ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={dynamicStyles.photoGradientBorder}
          >
            <View style={photoContainerStyle}>
              <TouchableOpacity
                onPress={isEditing ? onImagePicker : undefined}
                activeOpacity={isEditing ? 0.7 : 1}
                style={{ width: photoWidth, height: photoHeight, borderRadius: 8 }}
              >
                <Image
                  source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/icon.png')}
                  style={dynamicStyles.photo}
                />
                {isEditing && (
                  <View style={dynamicStyles.photoEditOverlay}>
                    <Text style={dynamicStyles.photoEditText}>📷</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <View style={dynamicStyles.mainInfo}>
            {isEditing ? (
              <>
                <TextInput
                  value={firstName}
                  onChangeText={text => onFieldChange?.('firstName', text)}
                  style={[dynamicStyles.name, dynamicStyles.editableField, { fontWeight: 'normal' }]}
                  placeholder="Prénom"
                  underlineColorAndroid="transparent"
                />
                <TextInput
                  value={lastName}
                  onChangeText={text => onFieldChange?.('lastName', text)}
                  style={[dynamicStyles.name, dynamicStyles.editableField, { fontWeight: 'normal' }]}
                  placeholder="Nom"
                  underlineColorAndroid="transparent"
                />
                <TextInput
                  value={location}
                  onChangeText={text => onFieldChange?.('location', text)}
                  style={[dynamicStyles.location, dynamicStyles.editableField, { fontWeight: 'normal' }]}
                  placeholder="Localisation"
                  underlineColorAndroid="transparent"
                />
                <TextInput
                  value={job}
                  onChangeText={text => onFieldChange?.('job', text)}
                  style={[dynamicStyles.job, dynamicStyles.editableField, { fontWeight: 'normal' }]}
                  placeholder="Poste"
                  underlineColorAndroid="transparent"
                />
                <TextInput
                  value={experience}
                  onChangeText={text => onFieldChange?.('experience', text)}
                  style={[dynamicStyles.experience, dynamicStyles.editableField, { fontWeight: 'normal' }]}
                  placeholder="Expérience"
                  underlineColorAndroid="transparent"
                />
                <TextInput
                  value={contractType}
                  onChangeText={text => onFieldChange?.('contractType', text)}
                  style={[dynamicStyles.contractType, dynamicStyles.editableField, { fontWeight: 'normal' }]}
                  placeholder="Type de contrat"
                  underlineColorAndroid="transparent"
                />
              </>
            ) : (
              <>
                <Text style={[dynamicStyles.name, { fontWeight: '700' }]}>{firstName} {lastName}</Text>
                {location && <Text style={[dynamicStyles.location, { fontWeight: '600' }]}>{location}</Text>}
                <Text style={[dynamicStyles.job, { fontWeight: '600' }]}>{job}</Text>
                <Text style={[dynamicStyles.experience, { fontWeight: '600' }]}>{experience}</Text>
                <Text style={[dynamicStyles.contractType, { fontWeight: '600' }]}>{contractType}</Text>
              </>
            )}
          </View>
        </View>
        <View style={dynamicStyles.detailsSection}>
          {isEditing ? (
            <TextInput
              value={presentation}
              onChangeText={text => onFieldChange?.('presentation', text)}
              style={[dynamicStyles.presentationText, dynamicStyles.editableField, { fontWeight: 'normal' }]}
              placeholder="Présentation"
              multiline
              underlineColorAndroid="transparent"
            />
          ) : (
            <>
              <View style={dynamicStyles.lineContainer}>
                <Text style={[dynamicStyles.presentationText, { fontWeight: '500' }]}>{lines[0] || ' '}</Text>
                <View style={dynamicStyles.separator} />
              </View>
              <View style={dynamicStyles.lineContainer}>
                <Text style={[dynamicStyles.presentationText, { fontWeight: '500' }]}>{lines[1] || ' '}</Text>
                <View style={dynamicStyles.separator} />
              </View>
              <View style={dynamicStyles.lineContainer}>
                <Text style={[dynamicStyles.presentationText, { fontWeight: '500' }]}>{lines[2] || ' '}</Text>
                <View style={dynamicStyles.separator} />
              </View>
            </>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}