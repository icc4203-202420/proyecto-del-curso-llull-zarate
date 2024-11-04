import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SearchBeer = ({ searchTerm, onSearchChange, onSearchSubmit }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.searchInput}
      placeholder="Buscar cervezas"
      value={searchTerm}
      onChangeText={onSearchChange}
    />
    <Button title="Buscar" onPress={onSearchSubmit} color="#000" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  searchInput: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 8,
    marginBottom: 8,
    color: '#000',
  },
});

export default SearchBeer;
