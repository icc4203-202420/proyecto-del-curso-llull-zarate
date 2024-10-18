import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

const BeerDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBeerDetails();
    const unsubscribe = navigation.addListener('focus', fetchBeerDetails);
    return unsubscribe;
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

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;
  if (!beer) return <Text style={styles.error}>No se encontraron detalles de la cerveza.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{beer.name}</Text>
      <Text style={styles.subtitle}>Producido Por: {beer.brewery_name || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Alcohol: {beer.alcohol || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Amargor (IBU): {beer.ibu || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Rating Promedio: {beer.averageRating || 'No disponible'}</Text>

      <Text style={styles.reviewsTitle}>Reseñas:</Text>
      {beer.reviews && beer.reviews.length > 0 ? (
        beer.reviews.map((review, index) => (
          <View key={index} style={styles.reviewCard}>
            <Text>Calificación: {review.rating}</Text>
            <Text>{review.text}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noReviews}>No hay reseñas para esta cerveza.</Text>
      )}

      <Button 
        title="Dejar una Reseña" 
        onPress={() => navigation.navigate('BeerReview', { beerId: beer.id, onReviewAdded: fetchBeerDetails })} 
        color="#000" 
      />
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
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 6,
    color: '#000',
  },
  reviewsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
  },
  reviewCard: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    marginVertical: 8,
  },
  noReviews: {
    fontStyle: 'italic',
    color: '#000',
  },
  error: {
    color: '#ff0000',
    fontSize: 16,
  }
});

export default BeerDetails;