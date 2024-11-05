import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import BeerCard from './BeerCard'; 
import SearchBeer from './SearchBeer'; 
import { useNavigation } from '@react-navigation/native';

const BeersList = () => {
  const [beers, setBeers] = useState([]);
  const [filteredBeers, setFilteredBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://192.168.0.23:3001/api/v1/beers')
      .then(response => {
        const uniqueBeers = response.data.beers.filter((beer, index, self) => 
          index === self.findIndex((b) => b.id === beer.id)
        ); 
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
    navigation.navigate('BeerDetailScreen', { id });
  };

  return (
    <View style={styles.container}>
      <SearchBeer 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearch}
      />
      <FlatList
        data={filteredBeers}
        keyExtractor={(beer) => beer.id.toString()}
        renderItem={({ item }) => (
          <BeerCard
            beer={item}
            onPress={() => handleBeerClick(item.id)}
          />
        )}
        ListEmptyComponent={<Text style={styles.noBeers}>No se encontraron cervezas.</Text>}
        contentContainerStyle={{ paddingBottom: 16 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  noBeers: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginVertical: 20,
  },
});

export default BeersList;
