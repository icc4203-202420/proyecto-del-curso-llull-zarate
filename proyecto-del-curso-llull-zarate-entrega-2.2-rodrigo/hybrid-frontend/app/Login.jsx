import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/v1/login', {
        user: { email, password },
      });

      const JWT_TOKEN = response.headers['authorization'];
      const CURRENT_USER_ID = response.data?.data?.id;

      if (JWT_TOKEN) {
        await SecureStore.setItemAsync('JWT_TOKEN', JWT_TOKEN);
      }

      if (CURRENT_USER_ID) {
        await SecureStore.setItemAsync('CURRENT_USER_ID', CURRENT_USER_ID.toString());
      }

      Alert.alert('Inicio de sesión exitoso', 'Bienvenido!');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      console.error('Error de inicio de sesión:', err);

      // Verificar si el error contiene una respuesta del servidor
      if (err.response && err.response.status === 401) {
        setError('Credenciales incorrectas. Por favor, intenta de nuevo.');
      } else {
        setError('Hubo un problema al intentar iniciar sesión. Verifica tu conexión.');
      }

      Alert.alert('Error de inicio de sesión', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        required
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Iniciar Sesión" onPress={handleLogin} color="#000" />
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.signUpText}>
          ¿No tienes cuenta? <Text style={styles.signUpLink}>Regístrate aquí</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  signUpText: {
    marginTop: 20,
    textAlign: 'center',
  },
  signUpLink: {
    color: '#FF8603', // Color mostaza
    fontWeight: 'bold',
  },
});

export default Login;