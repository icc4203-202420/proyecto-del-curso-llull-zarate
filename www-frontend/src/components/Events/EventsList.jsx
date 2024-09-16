import React, { useEffect, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Paper } from '@mui/material';
import axios from 'axios';

function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/events')
      .then(response => {
        setEvents(response.data.events || []);
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
          color: '#333',
          fontWeight: 'bold',
        }}
      >
        Lista de Eventos
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
              }}
            >
              <ListItem>
                <ListItemText
                  primary={event.name}
                  secondary={`Fecha: ${event.date}`}
                />
              </ListItem>
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
