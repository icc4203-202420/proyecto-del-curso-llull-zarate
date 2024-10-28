import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, SafeAreaView } from 'react-native';
import Slider from '@react-native-community/slider';

const BeerReviewForm = ({ beer, visible, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(1);

  const handleSubmit = () => {
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 15) {
      alert('Tu reseña debe tener al menos 15 palabras.');
      return;
    }
    onSubmit({ text, rating });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>{beer.name} - Reseña</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu reseña"
            placeholderTextColor="gray"
            value={text}
            onChangeText={setText}
          />
          <View style={styles.sliderContainer}>
            <Text>Calificación: {rating.toFixed(1)}</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={5}
              step={0.1}
              value={rating}
              onValueChange={setRating}
              minimumTrackTintColor="#000"
              maximumTrackTintColor="#888"
              thumbTintColor="#000"
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onClose} color="#000" />
            <Button title="Enviar" onPress={handleSubmit} color="#000" />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 30,
    color: '#000',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default BeerReviewForm;