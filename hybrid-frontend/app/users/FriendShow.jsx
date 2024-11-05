import React, { useEffect, useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const FriendShow = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [user, setUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const storedUserId = await SecureStore.getItemAsync('CURRENT_USER_ID');
        if (storedUserId) {
          setCurrentUserId(storedUserId);
        }
      } catch (error) {
        console.error('Error fetching CURRENT_USER_ID:', error);
      }
    };
    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://192.168.0.23:3001/api/v1/users/${id}`)
        .then(response => {
          setUser(response.data.user);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          setError('Error fetching user data');
        });
    }
  }, [id]);

  useEffect(() => {
    if (currentUserId && id) {
      axios.get(`http://192.168.0.23:3001/api/v1/users/${currentUserId}/friendships/${id}`)
        .then(response => {
          setIsFriend(response.data.is_friend);
        })
        .catch(error => {
          console.error('Error checking friendship:', error);
          setError('Error checking friendship');
        });
    }
  }, [id, currentUserId]);

  const handleAddFriend = async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      await axios.post(`http://192.168.0.23:3001/api/v1/users/${currentUserId}/friendships`, {
        friendship: { friend_id: id }
      });
      setIsFriend(true);
    } catch (error) {
      console.error('Error adding friend:', error);
      setError('Error adding friend');
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

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button
        title={isFriend ? "Already friends" : "Add Friend"}
        onPress={handleAddFriend}
        color="black"
        disabled={isFriend || loading}
      />

      {loading && <ActivityIndicator size="small" color="blue" style={styles.loadingIndicator} />}
    </View>
  );
};

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
