import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import BeerReviewItem from './BeerReviewItem';
import BeerReviewForm from './BeerReviewForm';
import BeerInfo from './BeerInfo'; // Importamos BeerInfo

const initialState = {
  reviews: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REVIEWS_SUCCESS':
      return { ...state, reviews: action.payload, loading: false };
    case 'FETCH_REVIEWS_ERROR':
      return { ...state, error: action.error, loading: false };
    case 'ADD_REVIEW_SUCCESS':
      return { ...state, reviews: [action.payload, ...state.reviews], loading: false };
    default:
      return state;
  }
}

const BeerDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [beer, setBeer] = useState(null);  // Aquí almacenamos los datos de la cerveza
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openReviewForm, setopenReviewForm] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/beers/${id}`)
      .then(response => setBeer(response.data.beer))  // Almacenamos los datos de la cerveza en beer
      .catch(error => console.error(error));

    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    axios.get(`http://localhost:3001/api/v1/beers/${id}/reviews`)
      .then(response => {
        dispatch({ type: 'FETCH_REVIEWS_SUCCESS', payload: response.data.reviews || [] });
      })
      .catch(error => dispatch({ type: 'FETCH_REVIEWS_ERROR', error: error.message }));
  };

  const handleReviewSubmit = async (values) => {
    const review = { text: values.text, rating: values.rating, beer_id: beer.id };
    await axios.post(`http://localhost:3001/api/v1/beers/${beer.id}/reviews`, { review });
    fetchReviews();
  };

  if (!beer) return <ActivityIndicator size="large" style={styles.loader} color="#000" />;

  return (
    <View style={styles.container}>
      {/* Aquí mostramos la información de la cerveza */}
      <BeerInfo beer={beer} />  {/* Pasamos el objeto beer a BeerInfo */}

      <Button title="Escribir una Reseña" onPress={() => setopenReviewForm(true)} color="#000" />
      <BeerReviewForm
        beer={beer}
        visible={openReviewForm}
        onClose={() => setopenReviewForm(false)}
        onSubmit={handleReviewSubmit}
      />

      <FlatList
        data={state.reviews}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={({ item }) => <BeerReviewItem review={item} />}
        ListEmptyComponent={<Text style={styles.noReviews}>No hay reseñas.</Text>}
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
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  noReviews: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});

export default BeerDetailScreen;
