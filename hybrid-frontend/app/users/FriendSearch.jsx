import React from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FriendSearch = ({ users, searchText, setSearchText, handleAddFriend }) => {
  const filteredUsers = users.filter(user =>
    user.handle.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Search for friends by handle"
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#a5a5a5"
      />
      <Text style={styles.sectionTitle}>Search Results</Text>
      <FlatList
        data={filteredUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userHandle}>@{item.handle}</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleAddFriend(item.id)}>
              <Text style={styles.buttonText}>Add Friend</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#000', // Borde negro para el input
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // Fondo blanco
    color: '#000', // Texto negro
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Título en negro
    marginBottom: 10,
  },
  userCard: {
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
  userHandle: {
    fontSize: 18,
    color: '#000', // Texto negro para los usuarios
  },
  button: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ffc107', // Botón amarillo
    color: '#000', // Texto negro
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default FriendSearch;
