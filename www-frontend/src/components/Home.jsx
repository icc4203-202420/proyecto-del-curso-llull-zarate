import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
        textAlign: 'center',
        padding: 2,
      }}
    >
      <Typography variant="h2" gutterBottom>
        Bienvenido a dRINK.IO
      </Typography>
      <Typography variant="h6" gutterBottom>
        La mejor aplicación para encontrar las mejores cervezas y bares.
      </Typography>
      <Button
        variant="contained"
        onClick={handleGetStarted}
        sx={{
          backgroundColor: 'white',
          color: 'black',
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
          marginTop: 2,
        }}
      >
        Get Started
      </Button>
    </Box>
  );
};

export default Home;
