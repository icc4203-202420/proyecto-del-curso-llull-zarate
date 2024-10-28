import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BeerInfo = ({ beer }) => (
  <View style={styles.container}>
    <Text style={styles.name}>{beer.name}</Text>
    <Text>Producido Por: {beer.producer}</Text>
    <Text>Alcohol: {beer.alcohol}%</Text>
    <Text>Amargor (IBU): {beer.ibu}</Text>
    <Text>Rating Promedio: {beer.average_rating || 'No disponible'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BeerInfo;
