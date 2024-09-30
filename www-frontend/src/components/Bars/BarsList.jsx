import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, Card, CardContent, Container } from '@mui/material';
import { Link } from 'react-router-dom'; 
import axios from 'axios';

function BarsList() {
  const [bars, setBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        setBars(response.data.bars || []);
        setFilteredBars(response.data.bars || []);
      })
      .catch(error => {
        console.error('Error al obtener los bares:', error);
      });
  }, []);

  const handleSearch = () => {
    const results = bars.filter(bar =>
      bar.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBars(results);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '10vh',
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
        padding: '16px',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: 'black' }}
      >
        Lista de Bares
      </Typography>
      <TextField
        label="Buscar bares"
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
      <Button
        component={Link}
        to="/bars-search"
        variant="contained"
        sx={{
          backgroundColor: 'black',
          color: 'white',
          '&:hover': {
            backgroundColor: '#333',
          },
          marginTop: '16px',
        }}
      >
        Ver Mapa
      </Button>
      <Box sx={{ marginTop: '16px' }}>
        {filteredBars.length > 0 ? (
          filteredBars.map((bar) => (
            <Container key={bar.id} sx={{ marginBottom: '16px' }}>
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
                  <Typography variant="h6">{bar.name}</Typography>
                  <Typography variant="body2">{bar.location}</Typography>
                  <Button
                    component={Link}
                    to={`/bar/${bar.id}`}
                    variant="contained"
                    sx={{
                      backgroundColor: 'black',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#333',
                      },
                      marginTop: '10px',
                    }}
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    component={Link}
                    to={`/bar/${bar.id}/events`}
                    variant="contained"
                    sx={{
                      backgroundColor: 'black',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: '#333',
                      },
                      marginTop: '10px',
                      marginLeft: '10px',
                    }}
                  >
                    Ver Eventos
                  </Button>
                </CardContent>
              </Card>
            </Container>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No se encontraron bares.
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default BarsList;
