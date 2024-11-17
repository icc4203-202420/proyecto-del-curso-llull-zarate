import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Usar SecureStore
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const JWT_TOKEN = await SecureStore.getItemAsync('JWT_TOKEN');

      if (!JWT_TOKEN) {
        Alert.alert('Error', 'No se encontró el token, por favor inicia sesión de nuevo.');
        return;
      }

      
      await axios.delete('http://192.168.0.207:3001/api/v1/logout', {
        headers: { Authorization: `${JWT_TOKEN}` }, 
      });

      
      await SecureStore.deleteItemAsync('JWT_TOKEN');
      await SecureStore.deleteItemAsync('CURRENT_USER_ID');

      Alert.alert('¡Cierre de sesión exitoso!');
      navigation.navigate('Login'); 
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      Alert.alert('Error', 'Hubo un problema al cerrar sesión. Por favor, intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Out</Text>
      <Text style={styles.subtitle}>¿Estás seguro de que quieres cerrar sesión?</Text>
      <Button title="Cerrar sesión" onPress={handleLogout} color="#FF8603" />
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Logout;
