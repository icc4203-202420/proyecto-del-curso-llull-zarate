import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, CircularProgress } from '@mui/material';

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('/api/v1/friendships', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFriends(response.data);
      } catch (error) {
        setError('Error fetching friends.');
      } finally {
        setLoading(false); // Cambia a false una vez que la carga haya finalizado
      }
    };

    fetchFriends();
  }, []);

  if (loading) return <CircularProgress />; // Muestra un spinner mientras se carga

  return (
    <div>
      <Typography variant="h2">Lista de Amigos</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <li key={friend.id}>{friend.name}</li>
          ))}
        </ul>
      ) : (
        <Typography>No tienes amigos.</Typography>
      )}
    </div>
  );
};

export default FriendList;
