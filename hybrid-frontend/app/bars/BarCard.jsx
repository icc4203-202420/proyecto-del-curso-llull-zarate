import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const BarCard = ({ bar, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.circle}>
      <Text style={styles.circleText}>{bar.name.charAt(0)}</Text>
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{bar.name}</Text>
      <Text style={styles.cardSubtitle}>Ubicación: {bar.location}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  circleText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
});

export default BarCard;
