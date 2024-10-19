import React, { useEffect, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function EventsBar() {
  const { id } = useParams(); // Obtén el ID del bar desde los parámetros de la ruta
  const [events, setEvents] = useState([]); // Estado para almacenar eventos

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/api/v1/bars/${id}/events`) // Solicita los eventos del bar
        .then(response => {
          setEvents(response.data.events || []); // Establece los eventos en el estado
        })
        .catch(error => {
          console.error('Error al obtener los eventos:', error);
        });
    }
  }, [id]);

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
          color: '#333',
          fontWeight: 'bold',
        }}
      >
        Eventos del Bar
      </Typography>
      <List sx={{ width: '100%', maxWidth: '600px' }}>
        {events.length > 0 ? (
          events.map((event) => (
            <Paper
              key={event.id}
              sx={{
                marginBottom: '10px',
                padding: '16px',
                backgroundColor: '#fff',
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ListItem>
                <ListItemText
                  primary={event.name || 'Nombre del Evento'} // Usa un valor por defecto si `event.name` es undefined
                  secondary={`Fecha: ${new Date(event.date).toLocaleDateString()}`}
                />
              </ListItem>
              <Button
                component={Link}
                to={`/bar/${id}/events/${event.id}`} // Navegar a la vista de detalles del evento
                variant="contained"
                sx={{
                  backgroundColor: '#000',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                  marginLeft: '10px'
                }}
              >
                Ver Detalles
              </Button>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No hay eventos disponibles para este bar.
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default EventsBar;
