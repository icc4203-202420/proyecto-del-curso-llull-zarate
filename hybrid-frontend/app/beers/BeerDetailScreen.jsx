import React, { useEffect, useReducer, useState } from 'react';
import { View, Text, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import BeerReviewItem from './BeerReviewItem';
import BeerReviewForm from './BeerReviewForm';
import BeerInfo from './BeerInfo';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

function userReviewsFirst(reviews, currentUserId) {
  const userReviews = reviews.filter(review => review.user_id === parseInt(currentUserId));
  const otherReviews = reviews.filter(review => review.user_id !== parseInt(currentUserId));
  return [...userReviews, ...otherReviews];
}

const initialState = {
  reviews: [],
  loading: true,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REVIEWS_SUCCESS':
      const orderedReviews = userReviewsFirst(action.payload.reviews, action.payload.currentUserId);
      return { ...state, reviews: orderedReviews, loading: false };
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
  const navigation = useNavigation();
  const [beer, setBeer] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [openReviewForm, setopenReviewForm] = useState(false);

  useEffect(() => {
    fetchBeerDetails();
    fetchReviews();
  }, [id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBeerDetails();
      fetchReviews();
    });

    return unsubscribe;
  }, [navigation]);

  const fetchBeerDetails = () => {
    axios.get(`http://192.168.0.12:3001/api/v1/beers/${id}`)
      .then(response => setBeer(response.data.beer))
      .catch(error => console.error(error));
  };

  const fetchReviews = async () => {
    const userId = await SecureStore.getItemAsync('CURRENT_USER_ID');
    axios.get(`http://192.168.0.12:3001/api/v1/beers/${id}/reviews`)
      .then(response => {
        dispatch({
          type: 'FETCH_REVIEWS_SUCCESS',
          payload: { reviews: response.data.reviews || [], currentUserId: userId }
        });
      })
      .catch(error => dispatch({ type: 'FETCH_REVIEWS_ERROR', error: error.message }));
  };

  const handleReviewSubmit = async (values) => {
    const review = {
      text: values.text,
      rating: values.rating,
      beer_id: beer.id,
    };

    const userId = await SecureStore.getItemAsync('CURRENT_USER_ID');
    if (userId) {
      try {
        const response = await axios.post(`http://192.168.0.12:3001/api/v1/beers/${beer.id}/reviews`, {
          review,
          user_id: userId
        });
        
        const newReview = response.data;

        if (newReview && newReview.text) {
          dispatch({
            type: 'ADD_REVIEW_SUCCESS',
            payload: newReview,
          });

          const updatedReviews = [newReview, ...state.reviews];
          const averageRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;

          setBeer((prevBeer) => ({
            ...prevBeer,
            average_rating: averageRating.toFixed(1),
          }));

          setopenReviewForm(false);
        } else {
          console.error("Error: La respuesta no contiene la reseña creada.");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!beer) return <ActivityIndicator size="large" style={styles.loader} color="#000" />;

  return (
    <View style={styles.container}>
      <BeerInfo beer={beer} />

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
