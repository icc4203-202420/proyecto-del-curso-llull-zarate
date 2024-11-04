import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EventDetails() {
  const { id } = useParams(); // ID del evento
  const [event, setEvent] = useState(null); // Estado para almacenar el evento
  const [checkingIn, setCheckingIn] = useState(false); // Estado para manejar el proceso de check-in
  const [openSnackbar, setOpenSnackbar] = useState(false); // Estado para el snackbar
  const [snackbarType, setSnackbarType] = useState('success'); // Tipo de snackbar (éxito o error)
  const userId = localStorage.getItem('CURRENT_USER_ID'); // Obtener ID del usuario

  // Efecto para obtener los detalles del evento
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/api/v1/events/${id}`)
        .then(response => {
          setEvent(response.data); // Establece el evento en el estado
        })
        .catch(error => {
          console.error('Error al obtener el evento:', error);
        });
    }
  }, [id]);

  // Función para manejar el check-in
  const handleCheckIn = () => {
    setCheckingIn(true);
    axios.post('http://localhost:3001/api/v1/attendances', {
      user_id: userId,
      event_id: id
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

  
  if (!event) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: '40px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#000' }}>{event.name}</Typography>
      <Typography variant="body1" gutterBottom sx={{ color: '#000' }}>
        {`Fecha: ${new Date(event.date).toLocaleDateString()}`}
      </Typography>
      <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
        {event.description}
      </Typography>
      {event.start_date && (
        <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
          {`Inicio: ${new Date(event.start_date).toLocaleDateString()}`}
        </Typography>
      )}
      {event.end_date && (
        <Typography variant="body2" gutterBottom sx={{ color: '#000' }}>
          {`Fin: ${new Date(event.end_date).toLocaleDateString()}`}
        </Typography>
      )}
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
        {checkingIn ? 'Confirmando...' : 'Confirmar Asistencia'}
      </Button>
      <Button
        component={Link}
        to={`/bar/${event.bar_id}/events`}
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

export default EventDetails;
