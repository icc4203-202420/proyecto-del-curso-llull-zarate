import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const EventUsers = ({ eventId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/events/${eventId}/attendees`)
      .then(response => {
        setUsers(response.data.attendees);
      })
      .catch(error => {
        console.error('Error fetching event attendees:', error);
      });
  }, [eventId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Amigos que asisten al evento:</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>@{item.handle}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noUsers}>No hay amigos asistiendo al evento.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userCard: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  userName: {
    fontSize: 16,
    color: '#000',
  },
  noUsers: {
    fontSize: 16,
    color: '#555',
  },
});

export default EventUsers;
