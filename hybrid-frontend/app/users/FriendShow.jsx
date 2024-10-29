import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

function FriendShow() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params; // Obtener el ID del amigo desde los parámetros de la navegación
  const [user, setUser] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Obtener el ID del usuario actual desde AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');
      if (storedUserId) {
        setCurrentUserId(storedUserId);
      }
    };
    fetchUserId();
  }, []);

  // Obtener la información del usuario amigo
  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/users/${id}`)
      .then(response => {
        setUser(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
      });
  }, [id]);

  // Verificar si el usuario ya es amigo
  useEffect(() => {
    if (currentUserId) {
      axios.get(`http://localhost:3001/api/v1/users/${currentUserId}/friendships/${id}`)
        .then(response => {
          setIsFriend(response.data.is_friend);
        })
        .catch(error => {
          console.error('Error fetching friendship data:', error);
        });
    }
  }, [id, currentUserId]);

  // Función para agregar al usuario como amigo
  const handleAddFriend = async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      await axios.post(`http://localhost:3001/api/v1/users/${currentUserId}/friendships`, {
        friendship: { friend_id: id }
      });
      setIsFriend(true);
    } catch (error) {
      console.error('Error adding friend:', error.response);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar al usuario como amigo
  const handleRemoveFriend = async () => {
    if (!currentUserId) return;
    setLoading(true);

    try {
      await axios.delete(`http://localhost:3001/api/v1/users/${currentUserId}/friendships/${id}`);
      setIsFriend(false);
    } catch (error) {
      console.error('Error removing friend:', error.response);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <ActivityIndicator size="large" color="black" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>{"< Back"}</Text>
      </TouchableOpacity>
      
      <Text style={styles.username}>@{user.handle}</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
      </View>

      {isFriend ? (
        <Button
          title="Remove Friend"
          onPress={handleRemoveFriend}
          color="red"
          disabled={loading}
        />
      ) : (
        <Button
          title="Add Friend"
          onPress={handleAddFriend}
          color="blue"
          disabled={loading}
        />
      )}

      {loading && <ActivityIndicator size="small" color="blue" style={styles.loadingIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    color: 'black',
    fontSize: 18,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
  },
  loadingIndicator: {
    marginTop: 10,
  },
});

export default FriendShow;
