import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

const TokenStorage = () => {
  const navigation = useNavigation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await SecureStore.getItemAsync('JWT_TOKEN');
        console.log('JWT_TOKEN:', token); // Verifica si el token está vacío o no
        navigation.navigate(token ? 'Home' : 'Login');
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.navigate('Login'); // En caso de error, redirigir a Login
      } finally {
        setIsCheckingAuth(false); // Indicar que terminó la comprobación
      }
    };

    checkAuthentication();
  }, [navigation]);

  if (isCheckingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF8603" />
      </View>
    );
  }

  return null; // Mientras no se esté comprobando, no renderiza nada
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TokenStorage;