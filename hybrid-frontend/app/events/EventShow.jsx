import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para obtener el token JWT

const EventShow = () => {
  const [barDetails, setBarDetails] = useState(null);
  const route = useRoute();
  const { barId, eventId } = route.params; // Recibimos barId y eventId
  const navigation = useNavigation();

  useEffect(() => {
    axios.get(`http://localhost:3001/api/v1/bars/${barId}`)
      .then(response => {
        setBarDetails(response.data.bar);
      })
      .catch(error => {
        console.error('Error fetching bar details:', error);
      });
  }, [barId]);

  const handleCheckIn = async () => {
    try {
      const JWT_TOKEN = await AsyncStorage.getItem('JWT_TOKEN'); // Obtenemos el token JWT del almacenamiento
      if (!JWT_TOKEN) {
        Alert.alert('Error', 'No se encontró el token JWT');
        return;
      }

      await axios.post(
        `http://localhost:3001/api/v1/events/${eventId}/check-in`, 
        {}, 
        { headers: { Authorization: `Bearer ${JWT_TOKEN}` } }
      );

      Alert.alert('Check-in realizado', 'Has hecho check-in en el evento. Tus amigos serán notificados.');
      // Aquí es donde puedes añadir la lógica para notificar a los amigos, por ejemplo, haciendo otra llamada a la API
    } catch (error) {
      console.error('Error al hacer check-in:', error);
      Alert.alert('Error', 'No se pudo hacer check-in en el evento.');
    }
  };

  if (!barDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando detalles del bar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.barName}>{barDetails.name}</Text>
      <Text style={styles.barLocation}>Ubicación: {barDetails.location}</Text>
      <Text style={styles.barDescription}>Descripción: {barDetails.description}</Text>

      {/* Botón para Check-in */}
      <TouchableOpacity style={styles.checkInButton} onPress={handleCheckIn}>
        <Text style={styles.checkInButtonText}>Hacer Check-in</Text>
      </TouchableOpacity>

      {/* Botón para ver eventos */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BarDetailScreen', { id: barDetails.id })}
      >
        <Text style={styles.buttonText}>Ver eventos en este bar</Text>
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
