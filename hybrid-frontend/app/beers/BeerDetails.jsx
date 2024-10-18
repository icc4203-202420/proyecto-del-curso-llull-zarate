import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import BeerReview from './BeerReview'; // Asegúrate de que la ruta sea correcta

const BeerDetails = ({ route, navigation }) => {
  const { beerId } = route.params; // Obtener beerId del route params
  const [beerDetails, setBeerDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Función para obtener detalles de la cerveza y reseñas
    const fetchBeerDetails = async () => {
      try {
        const beerResponse = await axios.get(`http://localhost:3001/api/v1/beers/${beerId}`);
        const reviewsResponse = await axios.get(`http://localhost:3001/api/v1/beers/${beerId}/reviews`);

        setBeerDetails(beerResponse.data);
        setReviews(reviewsResponse.data); // Suponiendo que el endpoint devuelve un array de reseñas
      } catch (error) {
        console.error('Error fetching beer details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeerDetails();
  }, [beerId]);

  const onReviewAdded = () => {
    // Vuelve a cargar los detalles y reseñas de la cerveza
    fetchBeerDetails();
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewContainer}>
      <Text style={styles.reviewRating}>Calificación: {item.rating}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Muestra un loading mientras se obtienen los datos
  }

  return (
    <View style={styles.container}>
      {beerDetails && (
        <>
          <Text style={styles.title}>{beerDetails.name}</Text>
          <Text>{beerDetails.description}</Text>

          {/* Agregar el botón para ir a BeerReview */}
          <Button
            title="Agregar Reseña"
            onPress={() => navigation.navigate('BeerReview', { beerId, onReviewAdded })}
          />

          {/* Renderiza las reseñas */}
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id.toString()} // Asumiendo que cada reseña tiene un id único
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewContainer: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  reviewRating: {
    fontWeight: 'bold',
  },
});

export default BeerDetails;
