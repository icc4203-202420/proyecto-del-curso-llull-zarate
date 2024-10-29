import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

function FriendSearch() {
  const [friends, setFriends] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');
      if (storedUserId) {
        setCurrentUserId(storedUserId);
      } else {
        console.error('CURRENT_USER_ID not found in AsyncStorage');
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      setLoading(true);
      axios.get('http://localhost:3001/api/v1/users')
        .then(response => {
          const filteredFriends = response.data.users.filter(user => user.id !== parseInt(currentUserId));
          setFriends(filteredFriends);
        })
        .catch(error => {
          console.error('Error fetching friends:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentUserId]);

  const filteredFriends = friends.filter(friend => 
    friend.handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      {loading ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <FlatList
          data={filteredFriends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.friendItem} 
              onPress={() => navigation.navigate('FriendShow', { id: item.id })} 
            >
              <Text style={styles.friendName}>{item.first_name} {item.last_name}</Text>
              <Text style={styles.friendHandle}>@{item.handle}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  friendItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  friendName: {
    fontSize: 18,
    color: 'black',
  },
  friendHandle: {
    fontSize: 14,
    color: 'gray',
  },
});

export default FriendSearch;
