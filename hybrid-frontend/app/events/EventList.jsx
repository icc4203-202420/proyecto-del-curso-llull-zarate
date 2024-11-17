import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    
    axios.get('http://192.168.0.207:3001/api/v1/events')
      .then(response => {
        setEvents(response.data.events);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
  }, []);

  const handleEventSelect = (eventId) => {
    
    navigation.navigate('EventIndex', { eventId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Eventos</Text>
      <FlatList
        data={events}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard} onPress={() => handleEventSelect(item.id)}>
            <Text style={styles.eventText}>{item.name}</Text>
            <Text style={styles.eventDate}>{item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  eventCard: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  eventText: {
    fontSize: 18,
    color: '#000',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventList;
