import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions, TextInput, TouchableOpacity, ViewStyle } from 'react-native';
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
  isEditing?: boolean;
  onFieldChange?: (field: string, value: string) => void;
  onImagePicker?: () => void;
}

function splitPresentationIntoLines(text: string, numLines: number, charsPerLine: number): string[] {
  if (!text) return Array(numLines).fill('');
  
  const words = text.replace(/\n/g, ' ').replace(/ +/g, ' ').trim().split(' ');
  const lines: string[] = Array(numLines).fill('');
  let currentLineIndex = 0;
  let wordIndex = 0;

  while (wordIndex < words.length && currentLineIndex < numLines) {
    const word = words[wordIndex];
    const testLine = lines[currentLineIndex] ? `${lines[currentLineIndex]} ${word}` : word;

    if (testLine.length <= charsPerLine) {
      lines[currentLineIndex] = testLine;
      wordIndex++;
    } else {
      currentLineIndex++;
    }
  }

  if (wordIndex < words.length) {
    lines[numLines - 1] = lines[numLines - 1].slice(0, charsPerLine - 3) + '...';
  }

  return lines;
}

export default function CandidateCard({
  avatarUrl,
  firstName = "",
  lastName = "",
  location = "",
  job = "",
  experience = "",
  contractType = "",
  presentation = "",
  isEditing = false,
  onFieldChange,
  onImagePicker,
}: CandidateCardProps) {
  const { width } = useWindowDimensions();
  const cardPadding = width * 0.04;
  const photoWidth = width * 0.34;
  const photoHeight = photoWidth * 1.25;
  const presentationLines = splitPresentationIntoLines(presentation, 4, 35);

  const renderField = (label: string, value: string, fieldName: string, placeholder: string) => {
    if (isEditing) {
      return (
        <View style={styles.row}>
          <Text style={[styles.label, { fontSize: width * 0.04 }]}>{label} : </Text>
          <TextInput
            value={value}
            onChangeText={text => onFieldChange?.(fieldName, text)}
            style={[styles.value, { fontSize: width * 0.04, flex: 1, marginLeft: 4 }]}
            placeholder={placeholder}
            underlineColorAndroid="transparent"
          />
        </View>
      );
    }
    return (
      <View style={styles.row}>
        <Text style={[styles.label, { fontSize: width * 0.04 }]}>{label} : </Text>
        <Text style={[styles.value, { fontSize: width * 0.04 }]}>{value}</Text>
      </View>
    );
  };

  return (
    <>
      <View style={{minHeight: 60}}>
        {isEditing ? (
          <View style={{flexDirection: 'row'}}>
            <TextInput
              value={firstName}
              onChangeText={text => onFieldChange?.('firstName', text)}
              placeholder="Prénom"
              style={styles.titleInput}
            />
            <TextInput
              value={lastName}
              onChangeText={text => onFieldChange?.('lastName', text)}
              placeholder="Nom"
              style={styles.titleInput}
            />
          </View>
        ) : (
          <Text style={styles.mainTitle}>{firstName} {lastName}</Text>
        )}
      </View>
      <LinearGradient
        colors={['#6746a8', '#6b25f9', '#07b9ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 14,
          padding: 2,
          width: width * 0.98,
          alignSelf: 'center',
        }}
      >
        <View style={{ backgroundColor: '#fff', borderRadius: 14, width: '100%' }}>
          <View style={[styles.card, { padding: cardPadding, borderRadius: 14 }]}> 
            <View style={styles.topRow}>
              <TouchableOpacity onPress={isEditing ? onImagePicker : undefined} activeOpacity={isEditing ? 0.7 : 1}>
                <LinearGradient
                  colors={['#6746a8', '#6b25f9', '#07b9ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 14,
                    padding: 2,
                    width: photoWidth + 4,
                    height: photoHeight + 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/icon.png')}
                    style={{
                      width: photoWidth,
                      height: photoHeight,
                      borderRadius: 14,
                      backgroundColor: '#f8f9fa',
                    }}
                  />
                   {isEditing && (
                    <View style={styles.photoEditOverlay}>
                      <Text style={styles.photoEditText}>📷</Text>
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <View style={styles.mainInfo}>
                {renderField("Lieu", location, "location", "Lieu")}
                {renderField("Poste", job, "job", "Poste recherché")}
                {renderField("Niveau", experience, "experience", "Niveau d'expérience")}
                {renderField("Contrat", contractType, "contractType", "Type de contrat")}
              </View>
            </View>
            <View style={styles.bottomBlock}>
              <Text style={[styles.label, { fontSize: width * 0.042 }]}>Présentation :</Text>
              <View style={{ height: 8 }} />
              {isEditing ? (
                 <TextInput
                    value={presentation}
                    onChangeText={text => onFieldChange?.('presentation', text)}
                    style={[styles.value, { fontSize: width * 0.04, minHeight: 88, textAlignVertical: 'top' }]}
                    placeholder="Présentez-vous..."
                    multiline
                  />
              ) : (
                <>
                  {presentationLines.map((line, index) => (
                    <Text key={index} style={[styles.value, { fontSize: width * 0.04, minHeight: 22 }]} numberOfLines={1}>
                      {line || ' '}
                    </Text>
                  ))}
                </>
              )}
            </View>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
    width: '100%',
    justifyContent: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    width: '100%',
  },
  mainInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    color: '#6746a8',
    lineHeight: 22,
  },
  value: {
    color: '#222',
    lineHeight: 22,
  },
  bottomBlock: {
    marginTop: 8,
    width: '100%',
  },
  photoEditOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEditText: {
    color: '#fff',
    fontSize: 18,
  },
  mainTitle: {
    fontWeight: 'bold',
    fontSize: 32, // Using a fixed size for consistency
    color: '#6746a8',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 18,
  },
  titleInput: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#6746a8',
    textAlign: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 5,
  }
});