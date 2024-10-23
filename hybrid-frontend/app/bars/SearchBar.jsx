import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SearchBar = ({ searchTerm, onSearchChange, onSearchSubmit }) => (
  <View style={styles.container}>
    <TextInput
      style={styles.searchInput}
      placeholder="Buscar bares"
      placeholderTextColor="#888" // Color del placeholder
      value={searchTerm}
      onChangeText={onSearchChange}
    />
    <Button title="Buscar" onPress={onSearchSubmit} color="#000" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderColor: '#000',  // Color del borde
    borderWidth: 1,
    padding: 8,
    marginRight: 8,
    color: '#000',  // Color del texto ingresado
    borderRadius: 8,
    backgroundColor: '#fff',  // Fondo del TextInput
  },
});

export default SearchBar;
