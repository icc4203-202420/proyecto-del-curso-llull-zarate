import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { savePushToken } from './notifications';
import api from './axiosConfig';
const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [country, setCountry] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!firstName || !lastName || !email || !handle || !password || !passwordConfirmation) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
      return;
    }

    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await api.post('/api/v1/signup', {
        user: {
          first_name: firstName,
          last_name: lastName,
          email,
          handle,
          password,
          address_attributes: {
            line1: line1 || null,
            line2: line2 || null,
            country: country || null,
          },
        },
      });

      if (response.status === 200) {
        const JWT_TOKEN = response.headers['authorization'];
        const CURRENT_USER_ID = response.data.data?.id || response.data.id;

        if (JWT_TOKEN) {
          await SecureStore.setItemAsync('JWT_TOKEN', JWT_TOKEN);
        }

        if (CURRENT_USER_ID) {
          await SecureStore.setItemAsync('CURRENT_USER_ID', CURRENT_USER_ID.toString());
        }

        await savePushToken();

        Alert.alert('Registro exitoso');
        setFirstName('');
        setLastName('');
        setEmail('');
        setHandle('');
        setPassword('');
        setPasswordConfirmation('');
        setCountry('');
        setLine1('');
        setLine2('');
        navigation.navigate('Login');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join('\n')
        : 'Por favor verifica tu información.';
      Alert.alert('Error durante el registro', errorMessage);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcomeText}>Welcome to dRINK.io</Text>

      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Handle (e.g., @kingofbeers)" value={handle} onChangeText={setHandle} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Confirm Password" secureTextEntry value={passwordConfirmation} onChangeText={setPasswordConfirmation} />
      <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />
      <TextInput style={styles.input} placeholder="Address Line 1" value={line1} onChangeText={setLine1} />
      <TextInput style={styles.input} placeholder="Address Line 2" value={line2} onChangeText={setLine2} />

      <View style={styles.buttonContainer}>
        <Button title="Registrarse" onPress={handleSubmit} color="#000" />
      </View>

      <Text style={styles.signInText}>
        ¿Ya tienes una cuenta?{' '}
        <Text style={styles.signInLink} onPress={() => navigation.navigate('Login')}>Iniciar Sesión</Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  welcomeText: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#000' },
  input: { borderWidth: 1, borderColor: '#000', marginBottom: 15, padding: 10, color: '#000' },
  buttonContainer: { marginTop: 20 },
  signInText: { marginTop: 15, textAlign: 'center', color: '#000' },
  signInLink: { color: 'black', fontWeight: 'bold' },
});

export default SignUp;
