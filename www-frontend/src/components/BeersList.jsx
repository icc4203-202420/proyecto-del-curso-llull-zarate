import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function BeersList() {
  const [beers, setBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers') // Asegúrate de usar la URL correcta para tu API
      .then(response => {
        setBeers(response.data);
      })
      .catch(error => {
        console.error('Error fetching beers:', error);
      });
  }, []);
  

  const handleSearch = () => {
    // Implementa la búsqueda aquí si es necesario
  };

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: 'black' }}
      >
        Lista de Cervezas
      </Typography>
      <TextField
        label="Buscar cervezas"
        variant="outlined"
        fullWidth
        margin="normal"
        sx={{ marginBottom: '16px' }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'black',
          color: 'white',
          '&:hover': {
            backgroundColor: '#333',
          },
        }}
        onClick={handleSearch}
      >
        Buscar
      </Button>
      <List sx={{ marginTop: '16px' }}>
        {beers.map((beer) => (
          <ListItem key={beer.id}>
            <ListItemText primary={beer.name} secondary={beer.description} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default BeersList;
