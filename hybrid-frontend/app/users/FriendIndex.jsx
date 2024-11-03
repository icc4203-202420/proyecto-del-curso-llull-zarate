import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FriendSearch from './FriendSearch';
import { useNavigation } from '@react-navigation/native';

export default function FriendIndex() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>dRINK.IO</Text>
      <FriendSearch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: 'black',
    fontSize: 18,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 20,
  },
});
