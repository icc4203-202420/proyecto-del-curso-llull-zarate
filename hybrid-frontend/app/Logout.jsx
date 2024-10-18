import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleLogout = async () => {
      await AsyncStorage.removeItem('token'); 
      navigation.navigate('Login'); // Navegar a la pantalla de inicio de sesión
    };

    handleLogout();
  }, [navigation]);

  return null;
};

export default Logout;
