import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarList from '../bars/BarsList';

const EventShow = () => {
  const [event, setEvent] = useState(null);
  const [barDetails, setBarDetails] = useState(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { barId } = route.params; // Recibimos el barId desde la navegación

  useEffect(() => {
    // Llamada para obtener los detalles del bar asociado al evento
    if (barId) {
      axios.get(`http://localhost:3001/api/v1/bars/${barId}`)
        .then(response => setBarDetails(response.data.bar))
        .catch(error => console.error('Error al obtener los detalles del bar:', error));
    }
  }, [barId]);

  // Función para realizar el check-in en el evento
  const handleCheckIn = async () => {
    setCheckingIn(true);
    const userId = await AsyncStorage.getItem('CURRENT_USER_ID');

    axios.post('http://localhost:3001/api/v1/attendances', {
        user_id: userId,
        event_id: route.params.eventId, // Utiliza el eventId recibido en la navegación
    })
    .then(response => {
        Alert.alert('Check-in realizado', 'Tus amigos serán notificados.');
    })
    .catch(error => {
        console.error('Error al hacer check-in:', error);
        Alert.alert('Error', 'No se pudo realizar el check-in.');
    })
    .finally(() => {
        setCheckingIn(false);
    });
  };

  if (!barDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando detalles del bar...</Text>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.barName}>{barDetails.name}</Text>
      <Text style={styles.barLocation}>Ubicación: {barDetails.location}</Text>
      <Text style={styles.barDescription}>Descripción: {barDetails.description}</Text>

      {/* Botón para Check-in */}
      <TouchableOpacity
        style={styles.checkInButton}
        onPress={handleCheckIn}
        disabled={checkingIn}
      >
        <Text style={styles.checkInButtonText}>Hacer Check-in</Text>
      </TouchableOpacity>

      {/* Botón para ver otros eventos del bar */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BarsList')}
      >
        <Text style={styles.buttonText}>Ver otros eventos en bares</Text>
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
  barName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  barLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  barDescription: {
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

export default EventShow;
