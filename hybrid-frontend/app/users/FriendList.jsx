import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const FriendList = ({ friends }) => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Your Friends</Text>
      {friends.length === 0 ? (
        <Text style={styles.noFriendsText}>no tienes amigos ):</Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.friendCard}>
              <Text style={styles.friendText}>@{item.handle}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Título en negro
    marginBottom: 10,
  },
  noFriendsText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#a5a5a5', // Texto gris
    marginBottom: 20,
  },
  friendCard: {
    padding: 15,
    backgroundColor: '#fff', // Fondo blanco
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#000', // Borde negro
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendText: {
    fontSize: 18,
    color: '#000', // Texto negro
  },
});

export default FriendList;
