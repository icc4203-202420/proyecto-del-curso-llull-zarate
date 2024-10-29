import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const EventIndex = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const route = useRoute();
  const { eventId } = route.params;
  const navigation = useNavigation();
  const userId = 'CURRENT_USER_ID'; // Cambiar por el ID del usuario actual

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/events/${eventId}`)
      .then(response => {
        setEventDetails(response.data.event);
      })
      .catch(error => console.error('Error fetching event details:', error));
  }, [eventId]);

  if (!eventDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando detalles del evento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{eventDetails.name}</Text>
      <Text style={styles.eventDate}>Fecha: {eventDetails.date}</Text>
      <Text style={styles.eventDescription}>Descripción: {eventDetails.description}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EventShow', { barId: eventDetails.bar_id })}
      >
        <Text style={styles.buttonText}>Ver detalles del bar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
  eventName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
  },
  checkInButton: {
    marginTop: 20,
    backgroundColor: '#ffc107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkInButtonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ffc107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EventIndex;
