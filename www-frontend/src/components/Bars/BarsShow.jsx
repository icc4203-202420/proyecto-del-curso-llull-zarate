import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, Button, CircularProgress, Container } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BarsShow() {
  const { id } = useParams(); // Obtén el ID del bar desde los parámetros de la ruta
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [checkingIn, setCheckingIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const userId = localStorage.getItem('CURRENT_USER_ID');

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3001/api/v1/bars/${id}`)
        .then(response => {
          setBar(response.data.bar || {});
        })
        .catch(error => {
          console.error('Error al obtener el bar:', error);
        });

      axios.get(`http://localhost:3001/api/v1/bars/${id}/events`)
        .then(response => {
          setEvents(response.data.events || []);
        })
        .catch(error => {
          console.error('Error al obtener los eventos del bar:', error);
        });
    }
  }, [id]);

  const handleCheckIn = (eventId) => {
    setCheckingIn(true);
    axios.post('http://localhost:3001/api/v1/attendances', {
      user_id: userId,
      event_id: eventId
    })
    .then(response => {
      setAttendance((prevState) => ({ ...prevState, [eventId]: true }));
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

  if (!bar || checkingIn) {
    return <CircularProgress />;
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
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: '#333',
          fontWeight: 'bold',
        }}
      >
        Detalles del Bar
      </Typography>
      <Card
        sx={{
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: '#fff',
          boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '600px'
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {bar.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {bar.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {bar.location}
          </Typography>
        </CardContent>
      </Card>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: '#333',
          fontWeight: 'bold',
          marginBottom: '20px',
        }}
      >
        Eventos en este Bar
      </Typography>
      {events.length > 0 ? (
        events.map((event) => (
          <Container key={event.id} sx={{ marginBottom: '16px' }}>
            <Card
              sx={{
                backgroundColor: 'lightgray',
                '&:hover': {
                  backgroundColor: 'gray',
                  color: 'white',
                },
              }}
            >
              <CardContent>
                <Typography variant="body2">
                  {event.location}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: '12px' }}>
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => handleCheckIn(event.id)}
                  sx={{
                    marginTop: '10px',
                    backgroundColor: attendance[event.id] ? 'green' : 'black',
                    '&:hover': {
                      backgroundColor: attendance[event.id] ? 'darkgreen' : '#333',
                    },
                  }}
                >
                  {attendance[event.id] ? 'Checked In' : 'Check In'}
                </Button>
              </CardContent>
            </Card>
          </Container>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">
          No hay eventos para este bar.
        </Typography>
      )}
    </Box>
  );
}

export default BarsShow;
