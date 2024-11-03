//este componente será responsable de renderizar la 
//información de cada cerveza 
//y manejar el evento cuando el usuario selecciona una cerveza.
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const BeerCard = ({ beer, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text style={styles.cardTitle}>{beer.name}</Text>
    <Text style={styles.cardSubtitle}>{beer.brewery?.name}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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

export default BeerCard;
