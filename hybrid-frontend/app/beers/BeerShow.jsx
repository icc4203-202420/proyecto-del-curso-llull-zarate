import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';

const BeerShow = ({ route, navigation }) => {
  const { beer } = route.params; 
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://192.168.0.3:3001/api/v1/beers/${beer.id}/reviews`)
      .then(response => {
        setReviews(response.data.reviews || []);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, [beer.id]);

  const handleSubmitReview = () => {
    if (review.trim().split(' ').length < 15) {
      alert('La reseña debe tener al menos 15 palabras.');
      return;
    }

    if (rating < 1 || rating > 5) {
      alert('El rating debe estar entre 1 y 5.');
      return;
    }

    const newReview = { text: review, rating };

    axios.post(`http://192.168.0.3:3001/api/v1/beers/${beer.id}/reviews`, newReview)
      .then(response => {
        setReviews([...reviews, response.data.review]);
        setReview('');
        setRating(0);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reseñas de {beer.name}</Text>
      <TextInput
        style={styles.reviewInput}
        placeholder="Escribe tu reseña"
        value={review}
        onChangeText={setReview}
      />
      <Button title="Enviar Reseña" onPress={handleSubmitReview} color="#000" />
      <FlatList
        data={reviews}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <Text>{item.text}</Text>
            <Text>Rating: {item.rating}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay reseñas aún.</Text>}
      />
    </View>
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
    marginBottom: 16,
  },
  reviewInput: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  reviewCard: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginVertical: 4,
  },
});

export default BeerShow;
