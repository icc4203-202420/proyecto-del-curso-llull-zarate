import React, { useEffect, useState } from 'react';
import { Typography, Box, List, ListItem, ListItemText, Button, Paper } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function EventsBar() {
  const { id } = useParams(); // Obtén el ID del bar desde los parámetros de la ruta
  const [events, setEvents] = useState([]); // Estado para almacenar eventos
  const [attendance, setAttendance] = useState({}); // Estado para el seguimiento de la asistencia

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

  const handleCheckIn = (eventId) => {
    axios.post(`http://localhost:3001/api/v1/attendances`, { event_id: eventId }) // Solicita confirmar la asistencia
      .then(response => {
        setAttendance((prevState) => ({ ...prevState, [eventId]: true })); // Actualiza el estado de asistencia
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
                to={`/bar/${id}/events/${event.id}`}
                variant="contained"
                color="primary"
                sx={{ marginLeft: '10px' }}
              >
                Ver Detalles
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleCheckIn(event.id)}
                disabled={attendance[event.id]}
                sx={{ marginLeft: '10px' }}
              >
                {attendance[event.id] ? 'Confirmado' : 'Confirmar Asistencia'}
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
