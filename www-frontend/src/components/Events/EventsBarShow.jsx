import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';

function EventsBarShow() {
  const { barId, eventId } = useParams(); // Obtiene los parámetros de la ruta
  const [eventDetails, setEventDetails] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const userId = localStorage.getItem('CURRENT_USER_ID');

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/events/${eventId}`) // Cambia la URL según sea necesario
      .then(response => {
        setEventDetails(response.data); // Asigna los detalles del evento al estado
      })
      .catch(error => {
        console.error('Error al obtener los detalles del evento:', error);
      });
  }, [eventId]);

  const handleCheckIn = () => {
    setCheckingIn(true);
    axios.post('http://localhost:3001/api/v1/attendances', {
      user_id: userId,
      event_id: eventId
    })
      .then(() => {
        setSnackbarType('success');
        setOpenSnackbar(true);
      })
      .catch(error => {
        console.error('Error al hacer check-in:', error);
        setSnackbarType('error');
        setOpenSnackbar(true);
      })
      .finally(() => {
        setCheckingIn(false);
      });
  };

  if (!eventDetails) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: '40px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#000' }}>{eventDetails.name}</Typography>
      <Typography variant="body1" gutterBottom sx={{ color: '#000' }}>
        {`Fecha: ${new Date(eventDetails.date).toLocaleDateString()}`}
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
        {eventDetails.description}
      </Typography>
      <Button
        variant="outlined" 
        onClick={handleCheckIn}
        disabled={checkingIn}
        sx={{
          marginTop: '20px',
          color: '#000', 
          borderColor: '#000', 
          '&:hover': {
            backgroundColor: '#f0f0f0', 
          },
        }}
      >
        {checkingIn ? 'Confirmando...' : 'CHECK-IN'}
      </Button>
      <Button
        component={Link}
        to={`/bar/${barId}/events`} 
        variant="outlined"
        sx={{ marginTop: '20px', color: '#000', borderColor: '#000' }} 
      >
        Volver a Eventos del Bar
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity={snackbarType} 
          sx={{ width: '100%', backgroundColor: snackbarType === 'success' ? '#4caf50' : '#f44336', color: '#FFFFFF' }}
        >
          {snackbarType === 'success' 
            ? '¡Check-in realizado con éxito!' 
            : 'Error al realizar el check-in.'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EventsBarShow;
