import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, Card, CardContent, Container } from '@mui/material';
import axios from 'axios';

function BarsList() {
  const [bars, setBars] = useState([]);
  const [filteredBars, setFilteredBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBar, setSelectedBar] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        console.log('Datos de bares:', response.data.bars); 
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

  const handleBarClick = (bar) => {
    setSelectedBar(bar);
  };

  const handleCloseReview = () => {
    setSelectedBar(null);
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
      <Box sx={{ marginTop: '16px' }}>
        {filteredBars.length > 0 ? (
          filteredBars.map((bar) => (
            <Container key={bar.id} sx={{ marginBottom: '16px' }}>
              <Card
                onClick={() => handleBarClick(bar)}
                sx={{
                  cursor: 'pointer',
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
      {/* Para mostrar detalles adicionales o un componente de reseña, descomentar */}
      {/* {selectedBar && (
        <BarReview bar={selectedBar} onClose={handleCloseReview} />
      )} */}
    </Box>
  );
}

export default BarsList;
