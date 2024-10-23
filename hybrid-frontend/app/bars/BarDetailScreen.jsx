import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarEventCard from './BarEventCard';

const BarDetailScreen = ({ route }) => {
  const { id } = route.params;
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/bars/${id}`)
      .then(response => {
        setBar(response.data.bar);
        setEvents(response.data.bar.events);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  const handleCheckIn = async (eventId) => {
    try {
      const JWT_TOKEN = await AsyncStorage.getItem('JWT_TOKEN');
      if (!JWT_TOKEN) {
        Alert.alert('Error', 'No se encontró el token JWT');
        return;
      }

      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/check-in`, 
        {}, 
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          }
        }
      );

      Alert.alert('Check-in realizado', 'Has hecho check-in en el evento. Tus amigos serán notificados.');
    } catch (error) {
      console.error('Error al hacer check-in:', error);
      Alert.alert('Error', 'No se pudo hacer check-in en el evento.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!bar) {
    return <Text style={styles.errorText}>No se encontró el bar.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bar.name}</Text>
      <Text style={styles.subtitle}>Ubicación: {bar.location || 'Ubicación no disponible'}</Text>
      <Text style={styles.subtitle}>Descripción: {bar.description || 'Descripción no disponible'}</Text>

      <Text style={styles.eventsTitle}>Eventos:</Text>
      <FlatList
        data={events}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <BarEventCard 
            event={item}
            onCheckIn={handleCheckIn} 
          />
        )}
        ListEmptyComponent={<Text style={styles.noEvents}>No hay eventos disponibles.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },
  noEvents: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#ff0000',
    fontSize: 16,
  },
  checkInButton: {
    marginTop: 20,
    backgroundColor: '#ffc107',  // Fondo ámbar
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkInButtonText: {
    color: '#000',  // Texto negro
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BarDetailScreen;
