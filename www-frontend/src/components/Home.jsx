import React from 'react';
import { Typography, Button, Box } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '20vh',
        backgroundColor: 'white', // Fondo blanco
        color: 'black', // Color del texto
        textAlign: 'center',
      }}
    >
      <Typography variant="h2" component="h1" gutterBottom>
        Welcome to dRINK.IO
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Your go-to app for beer and bar events
      </Typography>
      <Button 
        variant="contained" 
        sx={{ 
          mt: 1, 
          backgroundColor: 'black', // Fondo negro del botón
          color: 'white', // Texto blanco
          '&:hover': {
            backgroundColor: 'darkgrey', // Fondo del botón al pasar el ratón (opcional)
          }
        }}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default Home;
