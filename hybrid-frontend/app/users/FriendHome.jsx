import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function FriendHome() {
  const navigation = useNavigation();

  const handleClick = () => {
    navigation.navigate('FrendSearch');
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleClick}>
      <Image source={{ uri: 'your-image-url-here' }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>Friends</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 345,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  image: {
    height: 140,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
});
