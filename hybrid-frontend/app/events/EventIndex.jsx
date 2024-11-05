import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

const EventIndex = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const route = useRoute();
  const { eventId } = route.params;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://192.168.0.23:3001/api/v1/events/${eventId}`);
        setEventDetails(response.data.event);
        setError(null);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Error al cargar los detalles del evento.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Cargando detalles del evento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => setLoading(true) && fetchEventDetails()}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!eventDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Detalles del evento no disponibles.</Text>
      </View>
    );
  }

  const formattedDate = new Date(eventDetails.date).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.eventName}>{eventDetails.name}</Text>
      <Text style={styles.eventDate}>Fecha: {formattedDate}</Text>
      <Text style={styles.eventDescription}>Descripción: {eventDetails.description}</Text>

      <CustomButton
        text="Ver eventos en este bar (check-in)"
        onPress={() => navigation.navigate('BarDetailScreen', { barId: eventDetails.bar_id })}
      />

      <CustomButton
        text="Subir fotos del evento"
        onPress={() => navigation.navigate('EventPicture', { eventId, eventName: eventDetails.name })}
      />
    </View>
  );
};

const CustomButton = ({ text, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

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
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
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
  button: {
    marginTop: 20,
    backgroundColor: '#000', 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff', // Texto blanco
    fontWeight: 'bold',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#333', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default EventIndex;
