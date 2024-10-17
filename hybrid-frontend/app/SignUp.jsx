import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const [formData, setFormData] = useState({ email: '', password: '', passwordConfirmation: '' });
  const navigation = useNavigation();

  const handleChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async () => {
    if (formData.password !== formData.passwordConfirmation) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.3:3001/api/v1/signup', { 
        email: formData.email, 
        password: formData.password 
      });
      if (response.status === 200) {
        Alert.alert('Registro exitoso');
        navigation.navigate('Login');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar. Verifica la conexión.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" value={formData.email} onChangeText={(value) => handleChange('email', value)} style={styles.input} />
      <TextInput placeholder="Contraseña" secureTextEntry value={formData.password} onChangeText={(value) => handleChange('password', value)} style={styles.input} />
      <TextInput placeholder="Confirmar Contraseña" secureTextEntry value={formData.passwordConfirmation} onChangeText={(value) => handleChange('passwordConfirmation', value)} style={styles.input} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, borderColor: '#000', marginBottom: 15, padding: 10 },
  button: { backgroundColor: '#000', padding: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16 }
});

export default SignUp;
