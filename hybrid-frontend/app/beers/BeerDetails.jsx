import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';

const BeerDetails = ({ route, navigation }) => {
  const { id } = route.params;
  const [beer, setBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://192.168.0.3:3001/api/v1/beers/${id}`)
      .then(response => {
        setBeer(response.data.beer);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  if (!beer) return <Text>No se encontraron detalles de la cerveza.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{beer.name}</Text>
      <Text style={styles.subtitle}>Cervecería: {beer.brewery?.name || 'No disponible'}</Text>
      <Text style={styles.subtitle}>Bares que sirven esta cerveza:</Text>
      {beer.bars && beer.bars.length > 0 ? (
        beer.bars.map((bar, index) => (
          <View key={index} style={styles.barCard}>
            <Text>{bar.name}</Text>
            <Text>{bar.address}</Text>
          </View>
        ))
      ) : (
        <Text>No hay bares que sirvan esta cerveza.</Text>
      )}
      <Button title="Dejar una Reseña" onPress={() => navigation.navigate('BeerShow', { beer })} color="#000" />
      <Button title="Volver" onPress={() => navigation.goBack()} color="#000" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 4,
  },
  barCard: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginVertical: 4,
  },
});

export default BeerDetails;
