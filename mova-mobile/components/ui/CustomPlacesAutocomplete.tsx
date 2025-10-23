import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type Suggestion = {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text?: string;
  };
  [key: string]: any;
};

interface CustomPlacesAutocompleteProps {
  apiKey: string;
  value: string;
  onSelect: (item: Suggestion) => void;
}

const CustomPlacesAutocomplete: React.FC<CustomPlacesAutocompleteProps> = ({ apiKey, value, onSelect, ...props }) => {
  const [input, setInput] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Synchronise l'état interne 'input' avec la prop 'value' venant de l'extérieur
  useEffect(() => {
    setInput(value);
  }, [value]);

  const fetchSuggestions = useCallback(async (text: string) => {
    setInput(text);
    setError(null);
    if (text.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${apiKey}&language=fr&types=address`
      );
      const data = await res.json();
      if (data.status === 'OK') {
        setSuggestions(data.predictions as Suggestion[]);
      } else {
        setSuggestions([]);
        setError(data.error_message || data.status);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const handleSelect = (item: Suggestion) => {
    setInput(item.description);
    setSuggestions([]);
    onSelect(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color='#4930a3' style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Adresse postale"
          value={input}
          onChangeText={fetchSuggestions}
          autoCorrect={false}
          autoCapitalize="none"
          placeholderTextColor="#999"
          {...props}
        />
        {loading && <ActivityIndicator size="small" color="#999" />}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {suggestions.length > 0 && (
        <View style={styles.list}>
          {suggestions.map(item => (
            <TouchableOpacity key={item.place_id} style={styles.item} onPress={() => handleSelect(item)}>
              <Text style={styles.itemText}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  list: {
    position: 'absolute',
    top: 54, // height of inputContainer + a small margin
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    maxHeight: 300, // Augmenté de 200 à 300 pour afficher plus de suggestions
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  item: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomPlacesAutocomplete;