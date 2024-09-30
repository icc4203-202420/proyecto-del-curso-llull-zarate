import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BeerDetails = () => {
  const { id } = useParams();
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/beers/${id}`)
      .then(response => {
        setBeer(response.data.beer);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Typography>Cargando...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  if (!beer) return <Typography>No se encontraron detalles de la cerveza.</Typography>;

  return (
    <Box sx={{ padding: '16px', backgroundColor: '#f5f5f5', color: 'black' }}>
      <Typography variant="h4" sx={{ color: 'black' }}>{beer.name}</Typography>
      <Typography variant="h6" sx={{ color: 'black' }}>Cervecería: {beer.brewery?.name || 'No disponible'}</Typography>
      <Typography variant="h6" sx={{ color: 'black' }}>Bares que sirven esta cerveza:</Typography>
      {beer.bars && beer.bars.length > 0 ? (
        beer.bars.map((bar, index) => (
          <Card key={index} sx={{ marginBottom: '8px', backgroundColor: '#ffffff' }}>
            <CardContent>
              <Typography variant="body1" sx={{ color: 'black' }}>{bar.name}</Typography>
              <Typography variant="body2" sx={{ color: 'gray' }}>{bar.address}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography sx={{ color: 'black' }}>No hay bares que sirvan esta cerveza.</Typography>
      )}
      <Button 
        onClick={() => window.history.back()} 
        sx={{ marginTop: '16px', backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
      >
        Volver
      </Button>
    </Box>
  );
};

export default BeerDetails;
