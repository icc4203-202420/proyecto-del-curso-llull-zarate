import React, { useState, useEffect } from 'react';
import { Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function BarEvents({ barId }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (barId) {
      axios.get(`http://localhost:3001/api/v1/events/${barId}`) 
        .then(response => {
          setEvents(response.data);
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    }
  }, [barId]);
  

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
        Eventos Proximos:
      </Typography>
      <List sx={{ marginTop: '16px' }}>
        {events.map((event) => (
          <ListItem key={event.id}>
            <ListItemText primary={event.name} secondary={event.date} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default BarEvents;
