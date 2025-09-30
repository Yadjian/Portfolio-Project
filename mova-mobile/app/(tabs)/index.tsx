import { StyleSheet, Pressable, Text } from 'react-native';
import { View } from '@/components/Themed';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      {/* Conteneur pour le titre avec un rond/ovale */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Mova</Text>
      </View>
      
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

      {/* Bouton Connexion */}
      <Pressable style={styles.button} onPress={() => console.log('Naviguer vers Connexion')}>
        <Text style={styles.buttonText}>Connexion</Text>
      </Pressable>

      {/* Espacement entre les boutons */}
      <View style={{ marginVertical: 10 }} />

      {/* Bouton Créer mon compte */}
      <Pressable style={styles.button} onPress={() => console.log('Naviguer vers Créer mon compte')}>
        <Text style={styles.buttonText}>Créer mon compte</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    borderWidth: 2, // Épaisseur de la bordure
    borderColor: '#5800dbff', // Couleur de la bordure
    backgroundColor: '#5c00e7ff',
    borderRadius: 200, // Arrondi pour créer un cercle ou un ovale
    paddingVertical: 30, // Hauteur interne
    paddingHorizontal: 20, // Largeur interne
    marginBottom: 20, // Espacement sous le titre
    alignItems: 'center', // Centrer le texte horizontalement
    justifyContent: 'center', // Centrer le texte verticalement
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    backgroundColor: '#5800dbff', // Couleur de fond
    paddingVertical: 12, // Hauteur du bouton
    paddingHorizontal: 20, // Largeur interne
    borderRadius: 20, // Coins arrondis
    width: 200, // Largeur fixe
    alignItems: 'center', // Centrer le texte
  },
  buttonText: {
    color: '#FFFFFF', // Couleur du texte
    fontSize: 16,
    fontWeight: 'bold',
  },
});