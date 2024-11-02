import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, ActivityIndicator, Alert, StyleSheet, FlatList, Image } from 'react-native';
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
    fetchUserData();
    fetchEventPictures();
  }, []);

  const fetchEventPictures = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/v1/events/${eventId}/pictures`);
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

    if (!result.cancelled) {
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
      if (!storedUserId) return;

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

      await axios.post('http://localhost:3001/api/v1/event_pictures', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      Alert.alert('Picture uploaded', 'The picture has been successfully uploaded!');
      setPicture(null);
      setDescription('');
      setTaggedFriends([]);
      fetchEventPictures();
    } catch (error) {
      console.error('Error uploading picture:', error);
      Alert.alert('Error', 'Could not upload the picture.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Pictures to {eventName}</Text>

      <Button title="Pick an image from camera roll" onPress={pickImage} color="#000" />

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

      <Button
        title={loading ? 'Uploading...' : 'Upload Picture'}
        onPress={handleSubmit}
        color="#000"
        disabled={loading || !picture}
      />

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
