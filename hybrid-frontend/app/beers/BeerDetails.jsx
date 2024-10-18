import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const BeerDetails = ({ route, navigation }) => {
  const { id } = route.params; // Obtenemos el id de la cerveza
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBeerDetails();
    const unsubscribe = navigation.addListener('focus', fetchBeerDetails); // Recargar detalles cuando la pantalla está enfocada
    return unsubscribe; // Limpiar el listener
  }, [navigation]);

  const fetchBeerDetails = () => {
    axios.get(`http://localhost:3001/api/v1/beers/${id}`)
      .then(response => {
        setBeer(response.data.beer);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error}</Text>;
  if (!beer) return <Text>No se encontraron detalles de la cerveza.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{beer.name}</Text>
      <Text style={styles.subtitle}>Producido Por: {beer.brewery_name || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Alcohol: {beer.alcohol || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Amargor (IBU): {beer.ibu || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Rating Promedio: {beer.averageRating || 'No disponible'}</Text>

      <Text style={styles.subtitle}>Bares que sirven esta cerveza:</Text>
      {beer.bars && beer.bars.length > 0 ? (
        beer.bars.map((bar, index) => (
          <View key={index} style={styles.barCard}>
            <Text>{bar.name}</Text>
            <Text>{bar.address}</Text>
          </View>
        ))
      ) : (
        <Text>No hay bares que sirvan esta cerveza.</Text>
      )}
      
      <Button title="Dejar una Reseña" onPress={() => navigation.navigate('BeerReview', { beerId: beer.id, onReviewAdded: fetchBeerDetails })} color="#000" />
      <Button title="Volver" onPress={() => navigation.goBack()} color="#000" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 4,
  },
  barCard: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginVertical: 4,
  },
});

export default BeerDetails;
