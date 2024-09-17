import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardMedia, CardContent, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function EventsBarShow() {
    const { id } = useParams(); // Extrae el ID del bar desde los parámetros de la ruta
    const [events, setEvents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [checkingIn, setCheckingIn] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarType, setSnackbarType] = useState('success');
    const userId = localStorage.getItem('CURRENT_USER_ID');

    useEffect(() => {
        if (id) {
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
            // Actualiza el estado de asistencia
            setAttendance(prevState => ({
                ...prevState,
                [eventId]: true
            }));
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

    if (checkingIn) {
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
                Eventos del Bar
            </Typography>
            {events.length > 0 ? (
                events.map((event) => (
                    <Card
                        key={event.id}
                        sx={{
                            marginBottom: '10px',
                            padding: '16px',
                            backgroundColor: '#fff',
                            boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            maxWidth: '600px'
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            image={event.image || 'default-image-url'}
                            alt="Event image"
                        />
                        <CardContent>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOnIcon sx={{ color: 'gray', marginRight: '8px' }} />
                                {event.location}
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                                <AccessTimeIcon sx={{ color: 'gray', marginRight: '8px' }} />
                                {new Date(event.date).toLocaleDateString('es-ES', {
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
                                disabled={attendance[event.id]}
                                sx={{ marginTop: '16px' }}
                            >
                                {attendance[event.id] ? 'Confirmado' : 'Confirmar Asistencia'}
                            </Button>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Typography variant="body1" color="textSecondary">
                    No hay eventos disponibles para este bar.
                </Typography>
            )}
            
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
                        ? '¡Check-in realizado con éxito!' 
                        : 'Error al realizar el check-in.'}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EventsBarShow;
