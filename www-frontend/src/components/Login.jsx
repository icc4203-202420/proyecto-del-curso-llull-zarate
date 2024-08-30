import React from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function Login() {
  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: 'auto',
        padding: 2,
        backgroundColor: 'white', // Fondo blanco
        color: 'black', // Color del texto
        borderRadius: '8px', // Bordes redondeados
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Sombra sutil
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: 'black' }} // Color del texto
      >
        Login
      </Typography>
      <TextField
        label="Email"
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{ marginBottom: '16px' }} // Espaciado inferior
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{ marginBottom: '16px' }} // Espaciado inferior
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'black', // Fondo del botón negro
          color: 'white', // Texto del botón blanco
          '&:hover': {
            backgroundColor: '#333', // Fondo del botón al pasar el mouse
          },
          marginTop: 2,
        }}
      >
        Login
      </Button>
    </Box>
  );
}

export default Login;
