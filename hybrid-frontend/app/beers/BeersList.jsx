import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

const BeersList = ({ navigation }) => {
  const [beers, setBeers] = useState([]);
  const [filteredBeers, setFilteredBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        const uniqueBeers = response.data.beers.filter((beer, index, self) => 
          index === self.findIndex((b) => b.id === beer.id)
        ); // Eliminar duplicados
        setBeers(uniqueBeers);
        setFilteredBeers(uniqueBeers);
      })
      .catch(error => {
        console.error('Error al obtener las cervezas:', error);
      });
  }, []);

  const handleSearch = () => {
    const results = beers.filter(beer =>
      beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBeers(results);
  };

  const handleBeerClick = (id) => {
    navigation.navigate('BeerDetails', { id });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Cervezas</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar cervezas"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <Button title="Buscar" onPress={handleSearch} color="#000" />
      <FlatList
        data={filteredBeers}
        keyExtractor={(beer) => beer.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleBeerClick(item.id)}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>{item.brewery?.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>No se encontraron cervezas.</Text>}
        contentContainerStyle={{ paddingBottom: 16 }} // Habilita el scroll
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Permitir que ocupe toda la pantalla y habilitar scroll
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 16,
  },
  searchInput: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  card: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'gray',
  },
});

export default BeersList;
