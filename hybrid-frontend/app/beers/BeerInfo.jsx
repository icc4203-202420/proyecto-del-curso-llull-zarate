//omponente se encargará de mostrar la información principal de la cerveza.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BeerInfo = ({ beer }) => {
  return (
    <View>
      <Text style={styles.title}>{beer.name}</Text>
      <Text style={styles.subtitle}>Producido Por: {beer.brewery_name || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Alcohol: {beer.alcohol || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Amargor (IBU): {beer.ibu || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Rating Promedio: {beer.averageRating || 'No disponible'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 6,
    color: '#000',
  }
});

export default BeerInfo;
