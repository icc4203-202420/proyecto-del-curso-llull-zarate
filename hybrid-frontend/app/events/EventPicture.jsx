import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import EventPictureCard from './EventPictureCard';

const EventPicture = ({ route, navigation }) => {
  const { eventId, eventName } = route.params;
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState('');
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');
        if (storedUserId) {
          const response = await axios.get(`http://localhost:3001/api/v1/users/${storedUserId}`);
          setFriends(response.data.friends);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería de fotos');
      }
    };

    fetchUserData();
    fetchEventPictures();
    requestPermissions();
  }, []);

  const fetchEventPictures = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/events/${eventId}/pictures`);
      console.log('Fetched pictures:', response.data.pictures);
      setPictures(response.data.pictures);
    } catch (error) {
      console.error('Error fetching event pictures:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Image picker result:', result);

    if (!result.cancelled) {
      console.log('Selected image URI:', result.uri);
      setPicture(result.uri);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim() || !picture) {
      Alert.alert('Error', 'Todos los campos deben ser completados');
      return;
    }

    try {
      setLoading(true);
      const storedUserId = await AsyncStorage.getItem('CURRENT_USER_ID');
      if (!storedUserId) {
        Alert.alert('Error', 'No se pudo obtener el ID del usuario');
        return;
      }

      const formData = new FormData();
      formData.append('event_picture[picture]', {
        uri: picture,
        name: 'event.jpg',
        type: 'image/jpeg',
      });
      formData.append('event_picture[description]', description);
      formData.append('event_picture[event_id]', eventId);
      formData.append('event_picture[user_id]', storedUserId);
      formData.append('event_picture[tagged_friends]', JSON.stringify(taggedFriends));

      const JWT_TOKEN = await AsyncStorage.getItem('JWT_TOKEN');
      console.log('JWT Token:', JWT_TOKEN);

      await axios.post('http://localhost:3001/api/v1/event_pictures', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      });

      Alert.alert('Éxito', '¡La imagen se ha subido exitosamente!');
      setPicture(null);
      setDescription('');
      setTaggedFriends([]);
      fetchEventPictures();
    } catch (error) {
      console.error('Error uploading picture:', error);
      Alert.alert('Error', 'No se pudo subir la imagen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Pictures to {eventName}</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image from camera roll</Text>
      </TouchableOpacity>

      {picture && <Image source={{ uri: picture }} style={styles.previewImage} />}

      <TextInput
        style={styles.input}
        placeholder="Enter a description"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Tag friends (comma separated handles)"
        value={taggedFriends.join(', ')}
        onChangeText={(text) => setTaggedFriends(text.split(',').map(handle => handle.trim()))}
      />

      <TouchableOpacity
        style={[styles.button, (loading || !picture) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading || !picture}
      >
        <Text style={styles.buttonText}>{loading ? 'Uploading...' : 'Upload Picture'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#000" />}

      <FlatList
        data={pictures}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventPictureCard picture={item} />
        )}
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 16,
    marginBottom: 16,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    color: '#000',
  },
});

export default EventPicture;
