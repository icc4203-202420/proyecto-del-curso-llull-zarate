import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';

const EventPicture = ({ eventId, onClose, onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [friends, setFriends] = useState([]);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const navigation = useNavigation();

  const getToken = async () => {
    try {
      return await SecureStore.getItemAsync('JWT_TOKEN');
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFriends = async () => {
      const userId = await SecureStore.getItemAsync('CURRENT_USER_ID');
      const token = await getToken();
      if (userId && token) {
        try {
          const response = await axios.get(`http://192.168.0.207:3001/api/v1/users/${userId}`, {
            headers: { Authorization: `${token}` },
          });
          setFriends(response.data.friends);
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      } else {
        console.error('User ID or token not found');
      }
    };
    fetchFriends();
  }, []);

  const selectImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need access to your photo library to upload images.');
      return;
    }

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
      prevTaggedFriends.includes(friendId)
        ? prevTaggedFriends.filter((id) => id !== friendId)
        : [...prevTaggedFriends, friendId]
    );
  };

  const uploadImage = async () => {
    if (!image || !description.trim()) {
      Alert.alert('Error', 'Please select an image and enter a description.');
      return;
    }

    const token = await getToken();
    if (!token) {
      Alert.alert('Error', 'No token found');
      return;
    }

    const formData = new FormData();
    formData.append('event_picture[description]', description);
    formData.append('event_picture[picture]', {
      uri: image,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
    });
    taggedFriends.forEach((friendId) => {
      formData.append('event_picture[tagged_friends][]', friendId);
    });

    try {
      await axios.post(`http://192.168.0.207:3001/api/v1/events/${eventId}/pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      });
      Alert.alert('Success', 'The photo has been uploaded successfully.');
      onUploadComplete(); // Refrescar fotos en EventIndex
      onClose(); // Regresa a EventIndex
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error.message);
      Alert.alert('Error', 'There was a problem uploading the image.');
    }
  };

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Upload a New Photo</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePlaceholder}>Select Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Write a description..."
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.title}>Tag Friends:</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.friendItem, taggedFriends.includes(item.id) && styles.friendSelected]}
            onPress={() => toggleTaggedFriend(item.id)}
          >
            <Text style={styles.friendName}>{item.handle}</Text>
            <Text style={styles.friendTag}>
              {taggedFriends.includes(item.id) ? '💙' : '⬜️'}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
        <Text style={styles.uploadButtonText}>Upload Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  imageContainer: {
    width: '80%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: '#888',
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f9f9f9',
    color: '#000',
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#eaeaea',
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  friendName: {
    fontSize: 16,
    color: '#333',
  },
  friendTag: {
    fontSize: 14,
    color: '#007bff', // Color azul moderno
  },
  friendSelected: {
    backgroundColor: '#d0e8ff', // Azul claro para amigos seleccionados
  },
  uploadButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default EventPicture;
