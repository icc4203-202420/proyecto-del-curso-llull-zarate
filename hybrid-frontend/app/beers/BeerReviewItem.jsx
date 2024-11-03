import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rating } from 'react-native-ratings';

const BeerReviewItem = ({ review }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{review.user.handle.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.username}>@{review.user.handle}</Text>
    </View>
    <View style={styles.ratingContainer}>
      <Rating
        type="custom"
        imageSize={20}
        readonly
        startingValue={review.rating}
        fractions={1}
        ratingColor="#000"
        ratingBackgroundColor="#E0E0E0"
        tintColor="#fff"
      />
      <Text style={styles.rating}>{parseFloat(review.rating).toFixed(1)}</Text>
      <Text style={styles.date}>• 
        {new Date(review.created_at).toLocaleDateString()}</Text>
    </View>
    <Text style={styles.reviewText}>{review.text}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#000',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    fontSize: 14,
    color: '#000',
    marginLeft: 5,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginLeft: 5,
  },
  reviewText: {
    fontSize: 16,
    marginTop: 10,
    color: '#000',
  },
});

export default BeerReviewItem;