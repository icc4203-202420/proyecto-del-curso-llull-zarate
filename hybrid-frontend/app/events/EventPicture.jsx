import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, StyleSheet, FlatList, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import EventPictureCard from './EventPictureCard';
import { useNavigation } from '@react-navigation/native';

const EventPicture = ({ eventId: propEventId, eventName: propEventName }) => {
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState('');
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([]);
  const navigation = useNavigation();

  // Para pruebas, si no se pasan props, asigna valores ficticios
  const eventId = propEventId || '1'; // Puedes cambiar '1' por cualquier ID de prueba
  const eventName = propEventName || 'Evento de Prueba';

  useEffect(() => {
    fetchEventPictures();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Se necesita permiso para acceder a la galería de fotos');
    }
  };

  const fetchEventPictures = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/events/${eventId}/pictures`);
      setPictures(response.data.event_pictures);
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

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      const fileName = uri.split('/').pop();
      const fileExtension = fileName.split('.').pop();

      const mimeTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        heic: 'image/heic',
      };
      const mimeType = mimeTypes[fileExtension] || 'image/png';

      setPicture({ uri, name: fileName, type: mimeType });
    }
  };

  const handleSubmit = async () => {
    if (!description.trim() || !picture) {
      Alert.alert('Error', 'Todos los campos deben ser completados');
      return;
    }

    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('CURRENT_USER_ID');
      if (!userId) {
        Alert.alert('Error', 'No se pudo obtener el ID del usuario');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('event_picture[event_id]', eventId);
      formData.append('event_picture[user_id]', parseInt(userId, 10));
      formData.append('event_picture[description]', description);
      formData.append('event_picture[picture]', picture);
      formData.append('event_picture[tagged_friends]', JSON.stringify(taggedFriends));

      const JWT_TOKEN = await AsyncStorage.getItem('JWT_TOKEN');
      if (!JWT_TOKEN) {
        Alert.alert('Error', 'Token de autenticación no encontrado');
        setLoading(false);
        return;
      }

      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/pictures`, formData, {
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

      {picture && <Image source={{ uri: picture.uri }} style={styles.previewImage} />}

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
