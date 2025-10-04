import React from 'react';
import { View, Text, Pressable, useWindowDimensions, StyleSheet } from 'react-native';
import MovaLogo from '@/components/ui/MovaLogo';

export default function ChooseRegisterTypeScreen({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const buttonWidth = width * 0.85;
  const buttonRadius = height * 0.05;
  const buttonPaddingVertical = height * 0.03;
  const buttonMarginVertical = height * 0.01;

  return (
    <View style={[styles.container, { backgroundColor: '#fff' }]}>
      <View style={{ marginBottom: height * 0.02, marginTop: height * 0.04, alignItems: 'center' }}>
        <MovaLogo />
      </View>
      <Text
        style={{
          fontSize: width * 0.07,
          fontWeight: 'bold',
          color: '#6746a8',
          textAlign: 'center',
          marginBottom: height * 0.08,
          borderRadius: 25,
          paddingVertical: height * 0.04,
          paddingHorizontal: width * 0.09,
          marginVertical: height * 0.02,
        }}
      >
        Je suis ici pour...
      </Text>
      <Pressable
        style={{
          backgroundColor: '#07b9ff',
          borderRadius: buttonRadius,
          width: buttonWidth,
          paddingVertical: buttonPaddingVertical,
          elevation: 2,
          marginBottom: height * 0.03,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        onPress={() => navigation.navigate('RegisterCandidate')}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: width * 0.05,
            fontWeight: 'bold',
          }}
        >
          Candidater
        </Text>
      </Pressable>
      <Pressable
        style={{
          backgroundColor: '#6b25f9',
          borderRadius: buttonRadius,
          width: buttonWidth,
          paddingVertical: buttonPaddingVertical,
          elevation: 2,
          marginVertical: buttonMarginVertical,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
        onPress={() => navigation.navigate('RegisterRecruiter')}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: width * 0.05,
            fontWeight: 'bold',
          }}
        >
          Recruter
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});