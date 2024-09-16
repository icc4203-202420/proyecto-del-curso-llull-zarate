import React, { useEffect, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EventsBar() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/api/v1/bars/${id}/events`)
        .then(response => {
          setEvents(response.data.events || []);
        })
        .catch(error => {
          console.error('Error al obtener los eventos:', error);
        });
    }
  }, [id]);

  const handleCheckIn = (eventId) => {
    axios.post(`/api/v1/attendances`, { event_id: eventId })
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
              }}
            >
              <ListItem>
                <ListItemText
                  primary={event.name}
                  secondary={`Fecha: ${event.date}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCheckIn(event.id)}
                  disabled={attendance[event.id]}
                >
                  {attendance[event.id] ? 'Confirmado' : 'Confirmar Asistencia'}
                </Button>
              </ListItem>
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
