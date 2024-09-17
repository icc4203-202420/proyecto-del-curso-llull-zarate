import React, { useEffect, useState } from 'react';
import { Typography, Box, Card, CardMedia, CardContent, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function EventsShow() {
    const { id } = useParams(); // Extrae el ID de la URL
    const [event, setEvent] = useState(null);
    const [checkingIn, setCheckingIn] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarType, setSnackbarType] = useState('success');
    const userId = localStorage.getItem('CURRENT_USER_ID');

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:3001/api/v1/events/${id}`)
                .then(response => {
                    setEvent(response.data);
                })
                .catch(error => {
                    console.error('Error al obtener el evento:', error);
                });
        }
    }, [id]);

    const handleCheckIn = () => {
        setCheckingIn(true);
        axios.post('http://localhost:3001/api/v1/attendances', {
            user_id: userId,
            event_id: id
        })
        .then(response => {
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

    if (!event) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '20px' }}>
                <Link to="/events">
                    <ArrowBackIosIcon sx={{ color: 'black', fontSize: '1.5rem' }} />
                </Link>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {event.name}
                </Typography>
            </Box>

            <Card sx={{ maxWidth: 345, borderRadius: '16px', boxShadow: '2px 2px 20px rgba(0, 0, 0, 0.4)' }}>
                <CardMedia
                    component="img"
                    height="350"
                    image={event.image || 'default-image-url'}
                    alt="Event image"
                    sx={{ borderRadius: '16px 16px 0 0' }}
                />
                <CardContent>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ color: 'gray', marginRight: '8px' }} />
                        {event.location || 'Ubicación no disponible'}
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                        <AccessTimeIcon sx={{ color: 'gray', marginRight: '8px' }} />
                        {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '20px' }}>
                        {event.description}
                    </Typography>
                </CardContent>
            </Card>

            <Box sx={{ marginTop: '20px' }}>
                <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                >
                    {checkingIn ? <CircularProgress size={24} /> : 'Check-In'}
                </Button>
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setOpenSnackbar(false)} 
                    severity={snackbarType} 
                    sx={{ 
                        width: '100%', 
                        backgroundColor: snackbarType === 'success' ? '#212121' : '#212121',
                        color: '#FFFFFF'
                    }}
                >
                    {snackbarType === 'success' 
                        ? 'Checked-in! You have successfully registered for this event.' 
                        : 'You are already registered for this event.'}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default EventsShow;
