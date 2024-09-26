import React, { useState } from 'react';
import { Typography, TextField, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function UserSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/v1/friendships/search?query=${query}`);
      setUsers(response.data.users);
      setError(null);
    } catch (err) {
      setUsers([]);
      setError('No users found');
    }
  };

  const handleAddFriend = async (handle) => {
    try {
      await axios.post('/api/v1/friendships', { handle });
      alert('Friend added successfully!');
    } catch (err) {
      alert('Error adding friend');
    }
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
        Buscar Usuarios
      </Typography>
      <TextField
        label="Buscar por handle"
        variant="outlined"
        fullWidth
        margin="normal"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ marginBottom: '16px' }}
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

      {error && <Typography color="error" mt={2}>{error}</Typography>}

      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.handle} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddFriend(user.handle)}
            >
              Agregar
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default UserSearch;
