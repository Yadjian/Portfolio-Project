import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RecruiterCardProps {
  avatarUrl: string;
  companyName: string;
  firstName?: string;
  lastName?: string;
  location?: string;
  jobSeeking?: string;
  experienceRequired?: string;
  contractType?: string;
  presentation?: string;
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


export default function RecruiterCard({
  avatarUrl,
  companyName,
  firstName = "",
  lastName = "",
  location = "",
  jobSeeking = "",
  experienceRequired = "",
  contractType = "",
  presentation = "",
}: RecruiterCardProps) {
  const { width } = useWindowDimensions();
  const cardPadding = width * 0.04;
  const photoWidth = width * 0.34;
  const photoHeight = photoWidth * 1.25;
  const presentationLines = splitPresentationIntoLines(presentation, 4, 35);

  return (
    <>
      <Text style={{
        fontWeight: 'bold',
        fontSize: width * 0.08,
        color: '#6746a8',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 18,
      }}>{companyName}</Text>
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
              </LinearGradient>
              <View style={styles.mainInfo}>
                <View style={{ marginBottom: 8, marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={[styles.label, { fontSize: width * 0.04 }]}>Prénom : </Text>
                    <Text style={[styles.value, { fontSize: width * 0.04 }]}>{firstName}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={[styles.label, { fontSize: width * 0.04 }]}>Nom : </Text>
                    <Text style={[styles.value, { fontSize: width * 0.04 }]}>{lastName}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={[styles.label, { fontSize: width * 0.04 }]}>Lieu : </Text>
                    <Text style={[styles.location, { fontSize: width * 0.04, marginBottom: 0 }]}>{location}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={[styles.label, { fontSize: width * 0.04 }]}>Poste : </Text>
                    <Text style={[styles.value, { fontSize: width * 0.04 }]}>{jobSeeking}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={[styles.label, { fontSize: width * 0.04 }]}>Niveau : </Text>
                    <Text style={[styles.value, { fontSize: width * 0.04 }]}>{experienceRequired}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.label, { fontSize: width * 0.04 }]}>Contrat : </Text>
                    <Text style={[styles.value, { fontSize: width * 0.04 }]}>{contractType}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.bottomBlock}>
              <Text style={[styles.label, { fontSize: width * 0.042 }]}>Présentation :</Text>
              <View style={{ height: 8 }} />
              {presentationLines.map((line, index) => (
                <Text key={index} style={[styles.value, { fontSize: width * 0.04, minHeight: 22 }]} numberOfLines={1}>
                  {line || ' '}
                </Text>
              ))}
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
  location: {
    color: '#333',
    marginBottom: 8,
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'flex-start',
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
});
