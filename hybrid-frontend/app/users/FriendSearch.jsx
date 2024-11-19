import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const FriendSearch = () => {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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
    const fetchUsers = async () => {
      if (currentUserId) {
        setLoading(true);
        try {
          const response = await axios.get(`http://192.168.0.12:3001/api/v1/users`);
          const filteredUsers = response.data.users.filter(user => user.id !== parseInt(currentUserId));
          setUsers(filteredUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const filteredUsers = searchText.trim() === '' ? users : users.filter(user =>
    user.handle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search friends..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('FriendShow', { id: item.id })}>
              <View style={styles.friendItem}>
                <Text style={styles.friendName}>{item.first_name} {item.last_name}</Text>
                <Text style={styles.friendHandle}>@{item.handle}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={styles.noResultsText}>No users found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
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
  noResultsText: {
    textAlign: 'center',
    color: 'gray',
  },
});

export default FriendSearch;
