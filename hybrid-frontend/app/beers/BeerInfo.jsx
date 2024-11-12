import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const BeerInfo = ({ beer }) => (
  <TouchableOpacity style={styles.content}>
    <Text style={styles.name}>{beer.name}</Text>
    <Text style={styles.secondaryText}>
      {beer.beer_type} - {beer.style} — Alcohol: {beer.alcohol}% | IBU: {beer.ibu} | 
      Produced by: {beer.brewery_name}|Rating: {parseFloat(beer.avg_rating).toFixed(2) || 'N/A'}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  content: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  secondaryText: {
    fontSize: 16,
    color: '#555',
  },
});

export default BeerInfo;
