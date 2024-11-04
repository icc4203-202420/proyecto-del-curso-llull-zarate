import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    console.log('Botón de inicio de sesión presionado');
    try {
      const response = await axios.post('http://192.168.0.23:3001/api/v1/login', {
        user: {
          email,
          password,
        },
      });

      console.log('Respuesta recibida:', response.data);

      const JWT_TOKEN = response.headers['authorization'];
      const CURRENT_USER_ID = response.data.status.data.user.id;

      console.log('JWT_TOKEN:', JWT_TOKEN);
      console.log('CURRENT_USER_ID:', CURRENT_USER_ID);

      if (JWT_TOKEN && CURRENT_USER_ID) {
        await SecureStore.setItemAsync('JWT_TOKEN', JWT_TOKEN);
        await SecureStore.setItemAsync('CURRENT_USER_ID', CURRENT_USER_ID.toString());

        Alert.alert('Inicio de sesión exitoso', 'Bienvenido!');
        console.log('Navegando a Home');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      Alert.alert('Inicio de sesión fallido', 'Por favor, verifica tus credenciales.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry={!showPassword}
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.showPassword}>
          {showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        </Text>
      </TouchableOpacity>

      <Button
        title="Iniciar Sesión"
        onPress={handleSubmit}
        color="#000"
      />

      <Text style={styles.signupLink}>
        ¿No tienes cuenta?{' '}
        <Text style={styles.linkText} onPress={() => navigation.navigate('SignUp')}>
          Regístrate aquí
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    color: '#000',
  },
  showPassword: {
    textAlign: 'right',
    color: '#000',
    marginBottom: 20,
  },
  signupLink: {
    textAlign: 'center',
    marginTop: 10,
    color: '#000',
  },
  linkText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Login;
