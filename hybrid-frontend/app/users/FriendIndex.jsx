import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TextInput, Text, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import FriendList from './FriendList'; // Componente para la lista de amigos actuales
import FriendSearch from './FriendSearch'; // Componente para la búsqueda de nuevos amigos

function FriendIndex() {
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Obtener el currentUserId desde localStorage o contexto
  useEffect(() => {
    const storedUserId = localStorage.getItem('CURRENT_USER_ID');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    } else {
      console.error('CURRENT_USER_ID no encontrado en localStorage');
    }
  }, []);

  // Obtener la lista de usuarios y amigos al cargar la pantalla
  useEffect(() => {
    if (currentUserId) {
      setLoading(true);
      axios.get('http://localhost:3001/api/v1/users')
        .then(response => {
          setUsers(response.data.users);
          axios.get(`http://localhost:3001/api/v1/users/${currentUserId}/friends`)
            .then(friendResponse => {
              setFriends(friendResponse.data.friends);
            });
        })
        .catch(error => {
          console.error('Error fetching users and friends:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentUserId]);

  // Función para manejar la adición de un amigo
  const handleAddFriend = async (friendId) => {
    if (!currentUserId) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:3001/api/v1/users/${currentUserId}/friendships`,
        {
          friendship: { friend_id: friendId },
        },
      );

      console.log('Amigo agregado:', response.data);
      Alert.alert('Friend added', 'The friend has been successfully added!');
      // Actualizar la lista de amigos
      axios.get(`http://localhost:3001/api/v1/users/${currentUserId}/friends`)
        .then(friendResponse => {
          setFriends(friendResponse.data.friends); // Actualizar la lista de amigos
        });
    } catch (error) {
      console.error('Error al agregar amigo:', error.response);
      Alert.alert('Error', 'There was an error adding the friend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Lista de amigos actuales */}
      <FriendList friends={friends} />

      {/* Búsqueda y adición de nuevos amigos */}
      <FriendSearch
        users={users}
        searchText={searchText}
        setSearchText={setSearchText}
        handleAddFriend={handleAddFriend}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Fondo blanco para todo el contenedor
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000', // Título en negro
  },
  noFriendsText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#a5a5a5', // Texto gris claro
    marginBottom: 20,
  },
  friendCard: {
    padding: 15,
    backgroundColor: '#fff', // Fondo blanco para las tarjetas de amigos
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Borde gris claro
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendText: {
    fontSize: 18,
    color: '#000', // Texto negro para los amigos
  },
  input: {
    height: 40,
    borderColor: '#ccc', // Borde gris claro para el input
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // Fondo blanco para el input
    color: '#000', // Texto negro en el input
    marginBottom: 20,
  },
  inputPlaceholder: {
    color: '#a5a5a5', // Placeholder en gris claro
  },
  userCard: {
    padding: 15,
    backgroundColor: '#fff', // Fondo blanco para las tarjetas de búsqueda
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Borde gris claro
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userHandle: {
    fontSize: 18,
    color: '#000', // Texto negro para los usuarios
  },
  button: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ffb347', // Botón color ámbar
    color: '#000', // Texto negro en los botones
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default FriendIndex;
