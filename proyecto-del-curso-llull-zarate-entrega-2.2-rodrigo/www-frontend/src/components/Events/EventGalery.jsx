import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Grid } from '@mui/material';
import { useParams, Link } from 'react-router-dom'; // Importar Link para la navegación
import axios from 'axios';

const EventGalery = () => {
  const { id: eventId } = useParams(); // Obtener el ID del evento desde los parámetros
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`/api/v1/events/${eventId}/photos`);
        setPhotos(response.data);
      } catch (err) {
        console.error('Error al obtener las fotos:', err);
      }
    };
    fetchPhotos();
  }, [eventId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        color: 'black',
        textAlign: 'center',
        padding: 2,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Galería del Evento
      </Typography>

      {/* Botón negro que redirige a EventPhoto.jsx */}
      <Box sx={{ marginTop: 4 }}>
        <Link to={`/events/${eventId}/eventphoto`} style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: 'black',
              color: 'white',
              '&:hover': {
                backgroundColor: '#333',
              },
            }}
          >
            Subir Foto
          </Button>
        </Link>
      </Box>
      <Button
          component={Link}
          to={`/events/${eventId}`} 
          variant="outlined"
          sx={{ marginTop: '20px', color: '#000', borderColor: '#000' }} 
        >
          Volver
        </Button>

      <Box sx={{ marginTop: 4, width: '80%', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Fotos Subidas
        </Typography>
        {photos.length > 0 ? (
          <Grid container spacing={2}>
            {photos.map((photo, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <img
                  src={photo.url}
                  alt={`Foto del Evento ${index + 1}`}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No hay fotos disponibles.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default EventGalery;