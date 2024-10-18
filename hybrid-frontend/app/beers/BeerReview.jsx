import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import { Slider } from 'react-native-elements';
import axios from 'axios';

const BeerReview = ({ navigation, route }) => {
  const { beerId, onReviewAdded } = route.params; // Obtener beerId y onReviewAdded del route params
  const [rating, setRating] = useState(3);
  const [reviewText, setReviewText] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    const characterCount = reviewText.trim().length; // Contamos las letras

    if (characterCount < 15) {
      setError('La reseña debe tener al menos 15 letras');
      return;
    }

    setLoading(true); // Mostrar indicador de carga

    axios.post(`http://localhost:3001/api/v1/beers/${beerId}/reviews`, { 
      review: {
        rating,
        text: reviewText,
      },
    })
    .then(response => {
      setLoading(false); // Ocultar indicador de carga
      onReviewAdded(); // Llamar al callback para actualizar los detalles de la cerveza
      navigation.goBack(); // Volver a la pantalla anterior
    })
    .catch(error => {
      setLoading(false); // Ocultar indicador de carga
      setError('Error al enviar la evaluación, por favor intenta nuevamente');
      console.error('Error al enviar la evaluación:', error.response ? error.response.data : error.message);
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
      <Button 
        title={loading ? "Enviando..." : "Enviar evaluación"} 
        onPress={handleSubmit} 
        disabled={loading} // Desactivar el botón mientras se está enviando
      />
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: 'top', 
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default BeerReview;
