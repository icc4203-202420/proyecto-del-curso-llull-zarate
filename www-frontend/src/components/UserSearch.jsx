import React from 'react';
import { Typography, TextField, Button, Box } from '@mui/material';

function UserSearch() {
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: 'white', // Fondo blanco
        color: 'black', // Color del texto
        borderRadius: '8px', // Bordes redondeados
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Sombra sutil
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: 'black' }} // Color del texto
      >
        Buscar Usuarios
      </Typography>
      <TextField
        label="Buscar por handle"
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
        }}
      >
        Buscar
      </Button>
    </Box>
  );
}

export default UserSearch;
