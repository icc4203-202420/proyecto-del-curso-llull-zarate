Funciona para el ios simulator 
backend()
rails db:migrate
rails db:seed
rails server -b 0.0.0.0 -p 3001

hybrid-frontend()
npm start
ios simulator

//in case of token expires change tokenstorage
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

const TokenStorage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await SecureStore.getItemAsync('JWT_TOKEN');
        if (token) {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          // Verifica si el token ha expirado
          if (decodedToken.exp && decodedToken.exp > currentTime) {
            navigation.navigate('Home');
          } else {
            // Si el token ha expirado, navega a la pantalla de login y borra el token
            await SecureStore.deleteItemAsync('JWT_TOKEN');
            navigation.navigate('Login');
          }
        } else {
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.navigate('Login');
      }
    };

    checkAuthentication();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF8603" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TokenStorage;
