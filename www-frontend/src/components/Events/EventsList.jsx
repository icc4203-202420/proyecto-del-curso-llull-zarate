import React, { useEffect, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EventsList() {
  const [events, setEvents] = useState([]); // Estado para almacenar los eventos

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/events') // Solicita la lista de todos los eventos
      .then(response => {
        setEvents(response.data.events || []); // Establece los eventos en el estado
      })
      .catch(error => {
        console.error('Error al obtener los eventos:', error);
      });
  }, []);

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
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: '#000', // Cambiado a negro
          fontWeight: 'bold',
        }}
      >
        Todos los Eventos
      </Typography>
      <List sx={{ width: '100%', maxWidth: '600px' }}>
        {events.length > 0 ? (
          events.map((event) => (
            <Paper
              key={event.id}
              sx={{
                marginBottom: '10px',
                padding: '16px',
                backgroundColor: '#fff', // Fondo blanco para el Paper
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ListItem>
                <ListItemText
                  primary={event.name || 'Nombre del Evento'}
                  secondary={`Fecha: ${new Date(event.date).toLocaleDateString()}`}
                  sx={{ color: '#000' }} // Texto negro
                />
              </ListItem>
              <Button
                component={Link}
                to={`/events/${event.id}`}
                variant="contained"
                sx={{
                  backgroundColor: '#000', // Fondo negro para el botón
                  color: '#fff', // Texto blanco en el botón
                  '&:hover': {
                    backgroundColor: '#333', // Fondo gris oscuro al pasar el mouse
                  },
                  marginLeft: '10px',
                }}
              >
                Ver Detalles
              </Button>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No hay eventos disponibles.
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default EventsList;
