/*import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

const BarReview = ({ bar, onClose }) => {
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState(bar.reviews || []);

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleSubmitReview = () => {
    if (review.trim()) {
      const newReview = { text: review, date: new Date().toISOString() };
      setReviews([...reviews, newReview]);
      setReview('');
      
  };

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
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: 'black' }}
      >
        Reseñas de {bar.name}
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
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            '&:hover': {
              backgroundColor: '#333',
            },
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
                  {new Date(r.date).toLocaleDateString()}
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
          marginTop: '16px'
        }}
        onClick={onClose}
      >
        Cerrar
      </Button>
    </Box>
  );
};

export default BarReview;
*/