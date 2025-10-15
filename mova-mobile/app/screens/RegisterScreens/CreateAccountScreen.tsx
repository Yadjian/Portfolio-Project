import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, StyleSheet, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { register } from '../../../services/api';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../../lib/types';
import MovaLogo from '../../../components/ui/MovaLogo';
import { LinearGradient } from 'expo-linear-gradient';
import GenericInputBar from '../../../components/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { height, width } = Dimensions.get('window');

export default function CreateAccountScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<any>();
  const userType = route.params?.userType || 'candidate';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pseudo, setPseudo] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await register(email, password);
      if (res.success) {
        if (userType === 'candidate') {
          navigation.navigate('EditProfileScreen', { userType: 'candidate', startEditing: true } as never);
        } else {
          navigation.navigate('CreateCompany', { startEditing: true } as never);
        }
      } else {
        alert(res.message || 'Erreur lors de la création du compte.');
      }
    } catch (error) {
      alert('Erreur lors de la création du compte.');
    }
    setLoading(false);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, { flexGrow: 1 }]}
      enableOnAndroid={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.content}>
          <MovaLogo sizeProp={60} />
          <Text style={styles.title}>Inscription</Text>
          <GenericInputBar
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#6746a8"
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 16,
              fontSize: 16,
              width: '100%',
              height: 40,
              minHeight: 40,
              marginVertical: 10,
            }}
          />
          <GenericInputBar
            placeholder="Mot de passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholderTextColor="#6746a8"
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 16,
              fontSize: 16,
              width: '100%',
              height: 40,
              minHeight: 40,
              marginVertical: 10,
              paddingRight: 44,
            }}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(s => !s)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={22} color="#6746a8" />
              </TouchableOpacity>
            }
          />
          <GenericInputBar
            placeholder="Confirmer mot de passe"
            value={pseudo}
            onChangeText={setPseudo}
            secureTextEntry={true}
            placeholderTextColor="#6746a8"
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 16,
              fontSize: 16,
              width: '100%',
              height: 40,
              minHeight: 40,
              marginVertical: 10,
            }}
          />
          <LinearGradient
            colors={['#6746a8', '#6b25f9', '#07b9ff']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Pressable
              style={styles.pressable}
              onPress={handleSubmit}
              android_ripple={{ color: '#6b25f9' }}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Création...' : 'Créer mon compte'}
              </Text>
            </Pressable>
          </LinearGradient>
        </View>
      </View>
      <View style={{ height: 15 }} /> {/* marge en bas pour le clavier */}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6746a8',
    marginBottom: 40,
    marginTop: 60,
    textAlign: 'center',
  },
  inputItem: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
    minHeight: 40,
  },
  button: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 24,
  },
  pressable: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
