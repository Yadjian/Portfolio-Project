import React, { useState, useCallback } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

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

const CustomPlacesAutocomplete: React.FC<CustomPlacesAutocompleteProps> = ({ apiKey, value, onSelect }) => {
  const [input, setInput] = useState<string>(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
    <View style={autocompleteStyles.container}>
      <TextInput
        style={autocompleteStyles.input}
        placeholder="Adresse postale"
        value={input}
        onChangeText={fetchSuggestions}
        autoCorrect={false}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      {loading && <ActivityIndicator style={{ margin: 8 }} />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <View style={autocompleteStyles.list}>
        {suggestions.map(item => (
          <TouchableOpacity key={item.place_id} style={autocompleteStyles.item} onPress={() => handleSelect(item)}>
            <Text>{item.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const autocompleteStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  list: {
    backgroundColor: 'yellow',
    borderRadius: 5,
    maxHeight: 250,
    zIndex: 9999,
  },
  item: {
    padding: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default CustomPlacesAutocomplete;