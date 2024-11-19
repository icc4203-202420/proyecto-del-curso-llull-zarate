import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store'; // Manejo de almacenamiento seguro
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      console.log('Intentando cerrar sesión...');

      // Intenta eliminar el token del almacenamiento seguro, incluso si no existe
      await SecureStore.deleteItemAsync('JWT_TOKEN');
      await SecureStore.deleteItemAsync('CURRENT_USER_ID');

      console.log('JWT_TOKEN y CURRENT_USER_ID eliminados.');

      // Notifica al usuario que se cerró sesión
      Alert.alert('¡Cierre de sesión exitoso!', 'Has salido de tu cuenta.');
      console.log('Redirigiendo al Login...');

      // Redirige al inicio de sesión
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert(
        'Error',
        'Hubo un problema al intentar cerrar sesión. Redirigiendo de todas formas.'
      );

      // Redirige al login como última instancia
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
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