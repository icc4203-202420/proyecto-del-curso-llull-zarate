import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator, StyleSheet, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventPicture = ({ eventId: propEventId, eventName: propEventName }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [pictures, setPictures] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();

  const eventId = propEventId || route.params.eventId;
  const eventName = propEventName || route.params.eventName;

  useEffect(() => {
    const fetchFriends = async () => {
      const userId = await AsyncStorage.getItem('CURRENT_USER_ID');
      if (userId) {
        try {
          const response = await axios.get(`http://192.168.0.23:3001/api/v1/users/${userId}`);
          setFriends(response.data.friends);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    const fetchEventPictures = async () => {
      try {
        const response = await axios.get(`http://192.168.0.23:3001/api/v1/events/${eventId}/pictures`);
        setPictures(response.data.event_pictures);
      } catch (error) {
        console.error('Error fetching event pictures:', error);
      }
    };

    fetchFriends();
    fetchEventPictures();
  }, [eventId]);

  const selectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleTaggedFriend = (friendId) => {
    setTaggedFriends((prevTaggedFriends) =>
      prevTaggedFriends.includes(friendId) ? prevTaggedFriends.filter(id => id !== friendId) : [...prevTaggedFriends, friendId]
    );
  };

  const uploadImage = async () => {
    if (!image || !description) {
      Alert.alert('Error', 'Por favor selecciona una imagen y proporciona una descripción.');
      return;
    }
    setUploading(true);
    try {
      const userId = await AsyncStorage.getItem('CURRENT_USER_ID');
      const uriParts = image.split('.');
      const fileType = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append("event_picture[event_id]", eventId);
      formData.append("event_picture[user_id]", parseInt(userId, 10));
      formData.append("event_picture[description]", description);
      formData.append("event_picture[tagged_friends]", JSON.stringify(taggedFriends));
      formData.append("event_picture[picture]", {
        uri: image,
        type: `image/${fileType}`,
        name: `photo.${fileType}`,
      });

      const JWT_TOKEN = await AsyncStorage.getItem('JWT_TOKEN');
      if (!JWT_TOKEN) {
        Alert.alert('Error', 'Token de autenticación no encontrado');
        setUploading(false);
        return;
      }

      await axios.post(`http://localhost:3001/api/v1/events/${eventId}/pictures`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${JWT_TOKEN}`,
        }
      });

      Alert.alert('Éxito', 'La foto se ha subido exitosamente.');
      setImage(null);
      setDescription('');
      setTaggedFriends([]);
      fetchEventPictures(); 
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Hubo un problema al subir la imagen.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePlaceholder}>Seleccionar Imagen</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        placeholderTextColor="#555"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.title}>Amigos disponibles para etiquetar:</Text>
      <View style={styles.tagContainer}>
        <FlatList
          data={friends}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tagItem,
                taggedFriends.includes(item.id) && styles.tagItemSelected
              ]}
              onPress={() => toggleTaggedFriend(item.id)}
            >
              <Text style={styles.tagText}>{item.handle}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <TouchableOpacity
        style={[styles.uploadButton, uploading && styles.buttonDisabled]}
        onPress={uploadImage}
        disabled={uploading}
      >
        <Text style={styles.uploadButtonText}>{uploading ? 'Subiendo...' : 'Subir Foto'}</Text>
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="large" color="#000" style={styles.loader} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginVertical: 10,
  },
  imageContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    color: '#000',
    fontSize: 16,
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tagItem: {
    backgroundColor: '#000',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  tagItemSelected: {
    backgroundColor: '#555',
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
  },
  uploadButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#888',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
});

export default EventPicture;
