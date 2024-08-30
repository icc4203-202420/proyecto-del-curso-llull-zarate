import React, { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function BarsList() {
  const [bars, setBars] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        setBars(response.data);
      })
      .catch(error => {
        console.error('Error fetching bars:', error);
      });
  }, []);

  const handleSearch = () => {
    axios.get('http://localhost:3001/api/v1/bars')
      .then(response => {
        const filteredBars = response.data.filter(bar =>
          bar.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setBars(filteredBars);
      })
      .catch(error => {
        console.error('Error fetching bars:', error);
      });
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
      <List sx={{ marginTop: '16px' }}>
        {bars.map((bar) => (
          <ListItem key={bar.id}>
            <ListItemText primary={bar.name} secondary={bar.location} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default BarsList;
