import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function EventsShow() {
  const { id } = useParams(); // Obtiene el ID del evento desde los parámetros de la ruta
  const [event, setEvent] = useState(null); // Estado para almacenar el evento
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga del check-in

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/api/v1/events/${id}`) // Solicita los detalles del evento
        .then(response => {
          setEvent(response.data.event || null); // Establece el evento en el estado
        })
        .catch(error => {
          console.error('Error al obtener los detalles del evento:', error);
          setSnackbarType('error');
          setOpenSnackbar(true);
        });
    }
  }, [id]);

  const handleCheckIn = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token'); // Asegúrate de obtener el token correcto
    try {
      const response = await axios.post('http://localhost:3001/api/v1/attendances', {
        attendance: {
          event_id: id,
        },
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Envía el token en el encabezado
        },
      });
      console.log("Check-in successful:", response.data);
      setSnackbarType('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error during check-in:", error.response?.data || error.message);
      setSnackbarType('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!event) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '40px',
      }}
    >
      <Paper
        sx={{
          padding: '20px',
          maxWidth: '600px',
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: '#000' }}>
          {event.name || 'Nombre del Evento'}
        </Typography>
        <Typography variant="body1" sx={{ color: '#000' }}>
          {event.description || 'Descripción del evento no disponible.'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#000', marginTop: '10px' }}>
          Fecha: {new Date(event.date).toLocaleDateString()}
        </Typography>
        {event.start_date && (
          <Typography variant="body2" sx={{ color: '#000' }}>
            Inicio: {new Date(event.start_date).toLocaleDateString()}
          </Typography>
        )}
        {event.end_date && (
          <Typography variant="body2" sx={{ color: '#000' }}>
            Fin: {new Date(event.end_date).toLocaleDateString()}
          </Typography>
        )}
        <Box sx={{ marginTop: '20px' }}>
          <Button
            variant="contained"
            onClick={handleCheckIn}
            disabled={isLoading} // Desactiva el botón mientras se está procesando el check-in
            sx={{ color: '#fff', backgroundColor: '#000', '&:hover': { backgroundColor: '#333' } }} // Estilo del botón
          >
            {isLoading ? 'Registrando...' : 'Check In'} {/* Cambia el texto según el estado de carga */}
          </Button>
        </Box>
        <Button
          component={Link}
          to={`/events`} // Navega de vuelta a la lista de eventos
          variant="outlined"
          sx={{ marginTop: '20px', color: '#000', borderColor: '#000' }} // Botón con borde negro
        >
          Volver a Eventos
        </Button>
      </Paper>

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
            ? 'Check-in exitoso.' 
            : 'Error al realizar el check-in.'}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EventsShow;
