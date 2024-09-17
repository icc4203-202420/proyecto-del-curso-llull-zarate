import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent, Rating } from '@mui/material';
import axios from 'axios';

const BeerReview = ({ beer, onClose }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/beers/${beer.id}/reviews`)
      .then(response => {
        setReviews(response.data.reviews || []);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
  }, [beer.id]);

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleRatingChange = (event, newRating) => {
    setRating(newRating);
  };

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

    axios.post(`http://localhost:3001/api/v1/beers/${beer.id}/reviews`, newReview)
      .then(response => {
        setReviews([...reviews, response.data.review]); 
        setRating(0);
      })
      .catch(error => {
        console.error('Error submitting review:', error);
      });
  };

  const averageRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 'No hay calificaciones aún';

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, 0)',
        width: '80%',
        maxWidth: '600px',
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: 'black' }}>
        Reseñas de {beer.name}
      </Typography>

      <Typography variant="h6" sx={{ marginBottom: '16px' }}>
        Evaluación global: {averageRating}
      </Typography>

      <Box sx={{ marginBottom: '16px' }}>
        <Typography variant="h6">Agregar una reseña</Typography>
        <TextField
          label="Escribe tu reseña"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={review}
          onChange={handleReviewChange}
        />
        <Rating
          name="simple-controlled"
          value={rating}
          onChange={handleRatingChange}
          precision={0.5}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
            marginTop: '16px',
          }}
          onClick={handleSubmitReview}
        >
          Enviar Reseña
        </Button>
      </Box>

      <Box>
        {reviews.length > 0 ? (
          reviews.map((r, index) => (
            <Card key={index} sx={{ marginBottom: '8px' }}>
              <CardContent>
                <Typography variant="body1">{r.text}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(r.date).toLocaleDateString()} - Rating: {r.rating}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No hay reseñas aún.
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        sx={{
          backgroundColor: 'black',
          color: 'white',
          '&:hover': {
            backgroundColor: '#333',
          },
          marginTop: '16px',
        }}
        onClick={onClose}
      >
        Cerrar
      </Button>
    </Box>
  );
};

export default BeerReview;
