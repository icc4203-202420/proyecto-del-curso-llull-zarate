import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import BarEventCard from './BarEventCard';

const BarDetailScreen = ({ route }) => {
  const { barId } = route.params;
  const [bar, setBar] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastCheckIn, setLastCheckIn] = useState(null);

  useEffect(() => {
    axios.get(`http://192.168.0.23:3001/api/v1/bars/${barId}`)
      .then(response => {
        setBar(response.data.bar);
        const eventsWithCheckInStatus = response.data.bar.events.map(event => ({
          ...event,
          isCheckedIn: false, 
        }));
        setEvents(eventsWithCheckInStatus);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [barId]);

  const handleCheckIn = async (eventId) => {
    try {
      console.log('Intentando obtener JWT_TOKEN y CURRENT_USER_ID...');
      const JWT_TOKEN = await SecureStore.getItemAsync('JWT_TOKEN');
      const userId = await SecureStore.getItemAsync('CURRENT_USER_ID');
      
      console.log('JWT_TOKEN obtenido:', JWT_TOKEN);
      console.log('CURRENT_USER_ID obtenido:', userId);

      if (!JWT_TOKEN || !userId) {
        Alert.alert('Error', 'No se encontró el token JWT o el ID del usuario');
        return;
      }

      const response = await axios.post(
        `http://192.168.0.23:3001/api/v1/events/${eventId}/attendances`, 
        {
          attendance: {
            user_id: userId,
            event_id: eventId,
          },
        }, 
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          }
        }
      );

      console.log('Respuesta de check-in:', response.data);

      if (response.data.status === 'already_checked_in') {
        Alert.alert('Ya inscrito', 'Ya estás inscrito en este evento.');
      } else {
        Alert.alert('Check-in realizado', 'Has hecho check-in en el evento. Tus amigos serán notificados.');
        setLastCheckIn(`Check-in realizado en el evento con ID: ${eventId}`);
        
        setEvents(prevEvents =>
          prevEvents.map(event =>
            event.id === eventId ? { ...event, isCheckedIn: true } : event
          )
        );
      }
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

      {lastCheckIn && <Text style={styles.checkInConfirmation}>{lastCheckIn}</Text>}

      <Text style={styles.eventsTitle}>Eventos:</Text>
      <FlatList
        data={events}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.eventContainer}>
            <BarEventCard event={item} />
            
            <TouchableOpacity
              style={[
                styles.checkInButton,
                item.isCheckedIn && styles.disabledButton,
              ]}
              onPress={() => !item.isCheckedIn && handleCheckIn(item.id)}
              disabled={item.isCheckedIn}
            >
              <Text style={styles.checkInButtonText}>
                {item.isCheckedIn ? 'Ya inscrito' : 'Hacer Check-in'}
              </Text>
            </TouchableOpacity>
          </View>
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
  eventContainer: {
    marginBottom: 10,
  },
  checkInButton: {
    marginTop: 10,
    backgroundColor: '#000', // Fondo negro
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  checkInButtonText: {
    color: '#fff', // Texto blanco
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  checkInConfirmation: {
    textAlign: 'center',
    color: 'green',
    marginTop: 10,
    fontSize: 16,
  },
});

export default BarDetailScreen;
