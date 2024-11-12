import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const EventPicture = ({ eventId, onClose, onUploadComplete }) => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const getToken = async () => {
    try {
      const token = await SecureStore.getItemAsync('JWT_TOKEN');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

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

  const uploadImage = async () => {
    if (!image || !description) {
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

    try {
      await axios.post(`http://192.168.0.12:3001/api/v1/events/${eventId}/pictures`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`,
        },
      });
      Alert.alert('Success', 'The photo has been uploaded successfully.');
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading image:', error.response?.data || error);
      Alert.alert('Error', 'There was a problem uploading the image.');
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
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

        <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
          <Text style={styles.uploadButtonText}>Upload Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
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
