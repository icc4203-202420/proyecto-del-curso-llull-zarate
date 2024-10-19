import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de instalar esta librería

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')} // Navega a la pantalla de perfil
      >
        <Ionicons name="person-outline" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>dRINK.io</Text>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BeersList')}
      >
        <Text style={styles.buttonText}>Beers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('BarsList')}
      >
        <Text style={styles.buttonText}>Bars</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EventsList')}
      >
        <Text style={styles.buttonText}>Events</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  profileButton: {
    position: 'absolute', // Posición absoluta para colocar en la esquina
    top: 20, // Espaciado desde la parte superior
    right: 20, // Espaciado desde la derecha
    backgroundColor: '#fff', // Fondo blanco para el botón
    borderRadius: 50, // Bordes redondeados
    padding: 10, // Espaciado interno
    elevation: 3, // Sombra
  },
});

export default Home;
