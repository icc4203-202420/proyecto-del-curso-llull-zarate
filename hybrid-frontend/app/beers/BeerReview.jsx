import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Slider } from 'react-native-elements';
import axios from 'axios';

const BeerReview = ({ navigation, route }) => {
  const { beerId, onReviewAdded } = route.params;
  const [rating, setRating] = useState(3);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    const wordCount = reviewText.trim().split(/\s+/).length;

    if (wordCount < 15) {
      setError('La reseña debe tener al menos 15 palabras');
      return;
    }

    setLoading(true);

    axios.post(`http://localhost:3001/api/v1/beers/${beerId}/reviews`, {
      review: {
        rating,
        text: reviewText,
      },
    })
    .then(response => {
      setLoading(false);
      onReviewAdded();
      navigation.goBack();
    })
    .catch(error => {
      setLoading(false);
      setError('Error al enviar la evaluación, por favor intenta nuevamente');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Calificación: {rating.toFixed(1)}</Text>
      <Slider
        value={rating}
        onValueChange={setRating}
        maximumValue={5}
        minimumValue={1}
        step={0.5}
        thumbTintColor="black"
        minimumTrackTintColor="gray"
        maximumTrackTintColor="black"
      />
      <TextInput
        placeholder="Escribe tu evaluación"
        multiline
        style={styles.input}
        onChangeText={setReviewText}
        value={reviewText}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Enviar evaluación" onPress={handleSubmit} color="#000" />
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
  label: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    height: 100,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top',
    color: '#000',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default BeerReview;