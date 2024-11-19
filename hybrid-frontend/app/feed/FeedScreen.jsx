import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import createActionCableConsumer from '../../cable';

const FeedScreen = () => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fakePosts = [
      {
        id: 1,
        type: 'review',
        user: 'John Doe',
        content: '¡Me encantó esta cerveza!',
        rating: 4.5,
        createdAt: new Date().toISOString(),
        beerId: 1,
        beerName: 'IPA Beer',
        country: 'Chile',
      },
      {
        id: 2,
        type: 'event',
        user: 'Jane Smith',
        content: 'El bar estuvo increíble, ¡deben ir!',
        createdAt: new Date().toISOString(),
        barId: 5,
        barName: 'Red Brasserie',
        country: 'Argentina',
      },
    ];
    setPosts(fakePosts);
  }, []);

  useEffect(() => {
    let feedChannel;

    const setupWebSocket = async () => {
      const consumer = await createActionCableConsumer();

      if (consumer) {
        feedChannel = consumer.subscriptions.create(
          { channel: 'FeedChannel' },
          {
            received: (data) => {
              console.log('Mensaje recibido:', data);
              setPosts((prevPosts) => [data, ...prevPosts]);
            },
          }
        );
      }
    };

    setupWebSocket();

    return () => {
      if (feedChannel) feedChannel.unsubscribe();
    };
  }, []);

  const applyFilter = (filterType, searchValue) => {
    setFilter({ type: filterType, value: searchValue });
  };

  const filteredPosts = filter
    ? posts.filter((post) => {
        if (filter.type === 'friend') {
          return post.user.toLowerCase().includes(filter.value.toLowerCase());
        }
        if (filter.type === 'beer') {
          return post.beerName?.toLowerCase().includes(filter.value.toLowerCase());
        }
        if (filter.type === 'bar') {
          return post.barName?.toLowerCase().includes(filter.value.toLowerCase());
        }
        if (filter.type === 'country') {
          return post.country?.toLowerCase().includes(filter.value.toLowerCase());
        }
        return true;
      })
    : posts;

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => {
        if (item.type === 'review') {
          navigation.navigate('BeerDetailScreen', { id: item.beerId });
        } else if (item.type === 'event') {
          navigation.navigate('BarDetailScreen', { barId: item.barId });
        }
      }}
    >
      <View style={styles.postHeader}>
        <Text style={styles.postUser}>{item.user}</Text>
        <Text style={styles.postTime}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.postContent}>
        {item.content}
        {item.type === 'review' && ` - Rated ${item.rating}/5`}
        {item.type === 'event' && ` - Bar: ${item.barName}`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        <TouchableOpacity
          style={[styles.filterButton, filter?.type === 'friend' && styles.activeFilter]}
          onPress={() => applyFilter('friend', searchTerm)}
        >
          <Ionicons name="person" size={24} color={filter?.type === 'friend' ? '#fff' : '#000'} />
          <Text style={[styles.filterText, filter?.type === 'friend' && styles.activeFilterText]}>
            Amigos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter?.type === 'beer' && styles.activeFilter]}
          onPress={() => applyFilter('beer', searchTerm)}
        >
          <Ionicons name="beer" size={24} color={filter?.type === 'beer' ? '#fff' : '#000'} />
          <Text style={[styles.filterText, filter?.type === 'beer' && styles.activeFilterText]}>
            Cervezas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter?.type === 'bar' && styles.activeFilter]}
          onPress={() => applyFilter('bar', searchTerm)}
        >
          <Ionicons name="home" size={24} color={filter?.type === 'bar' ? '#fff' : '#000'} />
          <Text style={[styles.filterText, filter?.type === 'bar' && styles.activeFilterText]}>
            Bares
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter?.type === 'country' && styles.activeFilter]}
          onPress={() => applyFilter('country', searchTerm)}
        >
          <Ionicons name="globe" size={24} color={filter?.type === 'country' ? '#fff' : '#000'} />
          <Text style={[styles.filterText, filter?.type === 'country' && styles.activeFilterText]}>
            País
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, !filter && styles.activeFilter]}
          onPress={() => setFilter(null)}
        >
          <Ionicons name="list" size={24} color={!filter ? '#fff' : '#000'} />
          <Text style={[styles.filterText, !filter && styles.activeFilterText]}>
            Todos
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar..."
        placeholderTextColor="#aaa"
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPost}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', padding: 20, color: '#000' },
  filterContainer: { flexDirection: 'row', paddingVertical: 10, paddingHorizontal: 20 },
  filterButton: { alignItems: 'center', marginRight: 15, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 20, backgroundColor: '#000' },
  activeFilter: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#000' },
  filterText: { fontSize: 12, color: '#fff', marginTop: 5 },
  activeFilterText: { color: '#000' },
  listContainer: { paddingBottom: 20 },
  postContainer: { backgroundColor: '#f9f9f9', marginVertical: 10, marginHorizontal: 20, padding: 15, borderRadius: 10, borderColor: '#ddd', borderWidth: 1 },
  postHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  postUser: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  postTime: { fontSize: 12, color: '#555' },
  postContent: { fontSize: 14, color: '#333' },
  searchInput: { backgroundColor: '#eee', color: '#000', padding: 10, margin: 20, borderRadius: 10 },
});

export default FeedScreen;
