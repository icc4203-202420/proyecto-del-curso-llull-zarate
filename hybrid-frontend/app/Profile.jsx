import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Profile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState({}); // Estado para almacenar la información del usuario

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const JWT_TOKEN = await AsyncStorage.getItem('JWT_TOKEN');

        if (JWT_TOKEN) {
          const response = await axios.get('http://localhost:3001/api/v1/users/me', { 
            headers: { Authorization: `Bearer ${JWT_TOKEN}` },
          });
          setUser(response.data.user); // Almacena la información del usuario en el estado
        } else {
          console.log('No JWT token found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.info}>Nombre: {user.first_name} {user.last_name}</Text> {/* Cambiado a first_name y last_name */}
      <Text style={styles.info}>Email: {user.email}</Text>
      <Text style={styles.info}>Handle: {user.handle}</Text>
      <Button title="Cerrar Sesión" onPress={() => navigation.navigate('Logout')} color="#FF8603" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  info: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'left',
    color: '#555',
  },
});

export default Profile;
