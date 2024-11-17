import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EventPictureCard = ({ picture }) => {
  // Verifica si picture y su propiedad `image_url` están presentes
  const imageUrl = picture?.image_url || '';

  return (
    <View style={styles.card}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>Imagen no disponible</Text>
      )}
      <View style={styles.info}>
        <Text style={styles.description}>{picture.description || 'Sin descripción'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  noImageText: {
    fontSize: 14,
    color: '#888',
    alignSelf: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventPictureCard;
