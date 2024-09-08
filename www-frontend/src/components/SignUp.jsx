import React, { useState } from 'react';
import { TextField, Button, Typography, Link, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    handle: '',
    city: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      
      const response = await axios.post('http://localhost:3001/api/v1/signup', {
        user: { 
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          handle: formData.handle,
          city: formData.city,
          password: formData.password,
          password_confirmation: formData.passwordConfirmation,
        }
      });

      if (response.status === 200) {
        navigate('/login');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Error al registrarse. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Registrarse
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="firstName"
          label="Nombre"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <TextField
          name="lastName"
          label="Apellido"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <TextField
          name="email"
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          name="handle"
          label="Handle (ej. @kingofbeers)"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.handle}
          onChange={handleChange}
          required
        />
        <TextField
          name="city"
          label="Ciudad"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.city}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Contraseña"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.password}
          onChange={handleChange}
          required
        />
        <TextField
          name="passwordConfirmation"
          label="Confirmar Contraseña"
          type="password"
          variant="outlined"
          margin="normal"
          fullWidth
          value={formData.passwordConfirmation}
          onChange={handleChange}
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          sx={{ backgroundColor: 'black', color: 'white', marginTop: '16px' }}
          fullWidth
        >
          Registrarse
        </Button>
        <Typography variant="body2" align="center" sx={{ marginTop: '16px' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" variant="body2">
            Inicia sesión
          </Link>
        </Typography>
      </form>
    </Container>
  );
};

export default SignUp;
