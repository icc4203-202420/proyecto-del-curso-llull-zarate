import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import BarCard from './BarCard';
import SearchBar from './SearchBar';

const BarList = ({ navigation }) => {
  const [bars, setBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://192.168.0.12:3001/api/v1/bars')
      .then(response => {
        setBars(response.data.bars);
        setFilteredBars(response.data.bars); 
      })
      .catch(error => console.error(error));
  }, []);

  const handleSearchSubmit = () => {
    const results = bars.filter(bar =>
      bar.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBars(results);
  };

  const handleBarPress = (id) => {
    navigation.navigate('BarDetailScreen', { barId: id });
  };

  return (
    <View style={styles.container}>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
      />
      <FlatList
        data={filteredBars}
        keyExtractor={(bar) => bar.id.toString()}
        renderItem={({ item }) => (
          <BarCard bar={item} onPress={() => handleBarPress(item.id)} />
        )}
        ListEmptyComponent={<Text style={styles.emptyList}>No se encontraron bares.</Text>}
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
  emptyList: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
});

export default BarList;
