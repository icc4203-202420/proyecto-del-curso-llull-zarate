import React, { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function EventsList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/events')  // Obtener todos los eventos
      .then(response => {
        setEvents(response.data.events);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '10vh',
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: 'black',
        }}
      >
        Todos los Eventos
      </Typography>
      <List sx={{ marginTop: '16px' }}>
        {events.length > 0 ? (
          events.map((event) => (
            <ListItem key={event.id}>
              <ListItemText primary={event.name} secondary={`${event.date} - ${event.time}`} />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No se encontraron eventos.
          </Typography>
        )}
      </List>
    </Box>
  );
}

export default EventsList;
