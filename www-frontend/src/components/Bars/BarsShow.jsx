import React, { useState, useEffect } from 'react';
import { Typography, Box, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function BarsShow() {
  const { id } = useParams(); // Obtén el ID del bar desde los parámetros de la ruta
  const [bar, setBar] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
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
    }
  }, [id]);

  if (!bar || checkingIn) {
    return <CircularProgress />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Cambiado a 'flex-start' para alinear hacia arriba
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px', // Reduce el padding para que esté más arriba
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
          marginTop: '20px', // Agregado para empujar el Card hacia arriba
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
            {bar.description || 'Descripción no disponible.'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Dirección ID: {bar.address_id}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Ubicación: {bar.latitude}, {bar.longitude}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default BarsShow;
