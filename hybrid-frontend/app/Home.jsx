import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beers</Text>
      <Button title="Ver Cervezas" onPress={() => navigation.navigate('BeersList')} color="#000" />
      <Text style={styles.title}>Bars</Text>
      <Button title="Ver Bares" onPress={() => navigation.navigate('BarsList')} color="#000" />
      <Text style={styles.title}>Events</Text>
      <Button title="Ver Eventos" onPress={() => navigation.navigate('EventsList')} color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
});

export default Home;
