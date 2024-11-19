import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Alert, Modal } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation, useRoute } from '@react-navigation/native';
import EventPictureCard from './EventPictureCard';
import EventPicture from './EventPicture';

const EventIndex = () => {
  const [eventDetails, setEventDetails] = useState(null);
  const [pictures, setPictures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  // Función para obtener el token desde SecureStore
  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('JWT_TOKEN');
      return token;
    } catch (error) {
      console.error('Error getting token from SecureStore', error);
      return null;
    }
  };

  // Función para cargar las imágenes del evento
  const fetchEventPictures = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }
    try {
      const response = await axios.get(`http://192.168.0.12:3001/api/v1/events/${eventId}/pictures`, {
        headers: { Authorization: `${token}` },
      });
      setPictures(response.data.event_pictures);
    } catch (error) {
      console.error('Error fetching event pictures:', error);
      Alert.alert('Error', 'Could not load event pictures.');
    }
  }, [eventId]);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No token found');
        return;
      }
      try {
        const response = await axios.get(`http://192.168.0.12:3001/api/v1/events/${eventId}`, {
          headers: { Authorization: ` ${token}` },
        });
        setEventDetails(response.data.event);
      } catch (error) {
        console.error('Error fetching event details:', error);
        Alert.alert('Error', 'Could not load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
    fetchEventPictures();
  }, [eventId, fetchEventPictures]);


  const handleUploadComplete = () => {
    setModalVisible(false);
    fetchEventPictures();
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Detalles del evento */}
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{eventDetails?.name}</Text>
        <Text style={styles.eventDate}>{new Date(eventDetails?.date).toLocaleDateString()}</Text>
        <Text style={styles.eventDescription}>{eventDetails?.description}</Text>
      </View>

      {/* Botón de Check-In */}
      <TouchableOpacity
        style={styles.checkInButton}
        onPress={() => navigation.navigate('BarDetailScreen', { barId: eventDetails?.bar_id })}
      >
        <Text style={styles.checkInText}>Go to Bar for Check-In</Text>
      </TouchableOpacity>

      {/* Botón para añadir foto */}
      <TouchableOpacity style={styles.uploadButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.uploadButtonText}>Add Photo</Text>
      </TouchableOpacity>

      {/* Lista de fotos */}
      <FlatList
        data={pictures}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <EventPictureCard picture={item} />}
        contentContainerStyle={styles.pictureList}
      />

      {/* Modal de pantalla completa para subir la foto */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <EventPicture
          eventId={eventId}
          onClose={() => setModalVisible(false)}
          onUploadComplete={handleUploadComplete}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  eventDetailsContainer: { marginBottom: 20 },
  eventName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  eventDate: { fontSize: 16, color: '#666', marginBottom: 5 },
  eventDescription: { fontSize: 16, color: '#333', marginBottom: 10 },
  uploadButton: { backgroundColor: '#000', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  uploadButtonText: { color: '#fff', fontWeight: 'bold' },
  checkInButton: { backgroundColor: '#555', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  checkInText: { color: '#fff' },
  loadingText: { fontSize: 16, color: '#333', textAlign: 'center' },
  pictureList: { paddingBottom: 20 },
});

export default EventIndex;