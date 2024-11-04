import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const JWT_TOKEN = await AsyncStorage.getItem('JWT_TOKEN');

      if (!JWT_TOKEN) {
        Alert.alert('Error', 'No token found, please log in again.');
        return;
      }

      
      await axios.delete('http://localhost:3001/api/v1/logout', { 
        headers: { Authorization: `Bearer ${JWT_TOKEN}` }, 
      });


      await AsyncStorage.removeItem('JWT_TOKEN');
      await AsyncStorage.removeItem('CURRENT_USER_ID');

      Alert.alert('Success', 'Logged out successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') } 
      ]);
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.'); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Out</Text>
      <Text style={styles.subtitle}>Are you sure you want to log out?</Text>
      <Button title="Log Out" onPress={handleLogout} color="#FF8603" />
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
