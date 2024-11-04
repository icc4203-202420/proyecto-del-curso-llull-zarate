import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    // Verificar que todos los campos requeridos estén completos
    if (!firstName || !lastName || !email || !handle || !password || !passwordConfirmation) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    // Verificar que las contraseñas coincidan
    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    axios.post('http://localhost:3001/api/v1/signup', { // Cambia a la IP correcta
      user: {
        first_name: firstName,
        last_name: lastName,
        email,
        handle,
        password,
      },
    })
    .then(async response => {
      const JWT_TOKEN = response.headers['authorization'];
      const CURRENT_USER_ID = response.data.data.id;

      if (JWT_TOKEN) {
        console.log("Guardando JWT en SecureStore");
        await SecureStore.setItemAsync('JWT_TOKEN', JWT_TOKEN);
      }

        if (CURRENT_USER_ID) {
          await SecureStore.setItemAsync('CURRENT_USER_ID', CURRENT_USER_ID.toString());
        }

        SecureStore.setItemAsync('test_key', 'test_value')
        .then(() => console.log("Valor guardado con éxito en SecureStore"))
        .catch(err => console.error("Error al guardar en SecureStore:", err));

        Alert.alert('Registro exitoso');
        // Limpiar campos
        setFirstName('');
        setLastName('');
        setEmail('');
        setHandle('');
        setPassword('');
        setPasswordConfirmation('');
        navigation.navigate('Login');
      })
      .catch(error => {
        if (error.response) {
          console.error('Error durante el registro:', error.response.data);
          if (error.response.status === 422) {
            const errors = error.response.data.errors || {};
            const errorMessage = Object.values(errors).flat().join('\n');
            Alert.alert('Error durante el registro', errorMessage || 'Por favor verifica tu información.');
          } else {
            Alert.alert('Error durante el registro', error.response.data?.status?.message || 'Por favor verifica tu información.');
          }
        } else {
          // Manejador para errores sin response (problemas de red, etc.)
          console.error('Error de red u otro problema:', error.message);
          Alert.alert('Error de red', 'No se pudo conectar con el servidor. Inténtalo de nuevo.');
        }
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome to dRINK.io</Text>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Handle: (For example @kingofbeers)"
        value={handle}
        onChangeText={setHandle}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />

      <View style={styles.buttonContainer}>
        <Button title="Registrarse" onPress={handleSubmit} color="#000" />
      </View>

      <Text style={styles.signInText}>
        ¿Ya tienes una cuenta?{' '}
        <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>
          Iniciar Sesión
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
    padding: 10,
    color: '#000',
  },
  buttonContainer: {
    marginTop: 20,
  },
  signInText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#000',
  },
  signInLink: {
    color: '#FF8603',
    fontWeight: 'bold',
  },
});

export default SignUp;
