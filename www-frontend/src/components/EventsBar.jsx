import React, { useEffect, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EventsBar() {
  const { id } = useParams();  // ID del bar desde la URL
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState({});  // Para manejar el estado del check-in

  useEffect(() => {
    if (id) {
      axios.get(`/api/v1/bars/${id}/events`)  // Solicita los eventos del bar
        .then(response => {
          setEvents(response.data.events || []);
        })
        .catch(error => {
          console.error('Error al obtener los eventos:', error);
        });
    }
  }, [id]);

  const handleCheckIn = (eventId) => {
    axios.post(`/api/v1/attendances`, { event_id: eventId })  // Realiza el check-in
      .then(response => {
        setAttendance((prevState) => ({ ...prevState, [eventId]: true }));
      })
      .catch(error => {
        console.error('Error al hacer check-in:', error);
      });
  };

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
        Eventos del Bar
      </Typography>
      <List sx={{ marginTop: '16px' }}>
        {events.length > 0 ? (
          events.map((event) => (
            <ListItem key={event.id}>
              <ListItemText primary={event.name} secondary={`${event.date} - ${event.time}`} />
              <Button
                variant="contained"
                color="primary"
                disabled={attendance[event.id]}  // Deshabilita si ya se hizo check-in
                onClick={() => handleCheckIn(event.id)}  // Maneja el check-in
              >
                {attendance[event.id] ? 'Checked In' : 'Check In'}
              </Button>
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

export default EventsBar;
