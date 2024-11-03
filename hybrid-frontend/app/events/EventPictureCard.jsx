import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EventPictureCard = ({ picture }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: picture.url }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.description}>{picture.description}</Text>
        <Text style={styles.tagged}>Tagged friends: {picture.tagged_friends.join(', ')}</Text>
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
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tagged: {
    fontSize: 14,
    color: '#555',
  },
});

export default EventPictureCard;
