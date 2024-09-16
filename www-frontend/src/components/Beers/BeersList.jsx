import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, Card, CardContent, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BeerReview from './BeerReview'; // Importa el componente BeerReview

function BeersList() {
  const [beers, setBeers] = useState([]);
  const [filteredBeers, setFilteredBeers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBeerForReview, setSelectedBeerForReview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/beers')
      .then(response => {
        setBeers(response.data.beers || []);
        setFilteredBeers(response.data.beers || []);
      })
      .catch(error => {
        console.error('Error al obtener las cervezas:', error);
      });
  }, []);

  const handleSearch = () => {
    const results = beers.filter(beer =>
      beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBeers(results);
  };

  const handleBeerClick = (id) => {
    navigate(`/beer/${id}`); // Redirige a la página de detalles de la cerveza
  };

  const handleReviewClick = (beer) => {
    setSelectedBeerForReview(beer);
  };

  const handleCloseReview = () => {
    setSelectedBeerForReview(null);
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
      <Box sx={{ marginTop: '16px' }}>
        {filteredBeers.length > 0 ? (
          filteredBeers.map((beer) => (
            <Container key={beer.id} sx={{ marginBottom: '16px' }}>
              <Card sx={{ padding: '16px', backgroundColor: 'lightgray' }}>
                <CardContent>
                  <Typography variant="h6">{beer.name}</Typography>
                  <Typography variant="body2">{beer.brewery?.name}</Typography>

                  <Box sx={{ marginTop: '16px' }}>
                    <Button
                      variant="contained"
                      sx={{ marginRight: '8px', backgroundColor: 'black', color: 'white' }}
                      onClick={() => handleBeerClick(beer.id)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ backgroundColor: 'black', color: 'white' }}
                      onClick={() => handleReviewClick(beer)}
                    >
                      Reseña
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Container>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No se encontraron cervezas.
          </Typography>
        )}
      </Box>

      {/* Mostrar el componente BeerReview si hay una cerveza seleccionada */}
      {selectedBeerForReview && (
        <BeerReview beer={selectedBeerForReview} onClose={handleCloseReview} />
      )}
    </Box>
  );
}

export default BeersList;
