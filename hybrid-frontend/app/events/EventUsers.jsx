import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function EventsUsers() {
    const [users, setUsers] = useState([]);
    const [event, setEvent] = useState({});
    const [friends, setFriends] = useState([]);
    const route = useRoute();
    const { id } = route.params;
    const navigation = useNavigation();

    useEffect(() => {
        const fetchEventData = async () => {
            const currentUserId = await AsyncStorage.getItem('CURRENT_USER_ID');

            
            axios.get(`http://192.168.0.23:3001/api/v1/events/${id}`)
                .then(response => {
                    setEvent(response.data);
                    setUsers(response.data.users);
                })
                .catch(error => console.error('Error fetching event:', error));

            l
            if (currentUserId) {
                axios.get(`http://192.168.0.23:3001/api/v1/users/${currentUserId}/friendships`)
                    .then(response => {
                        setFriends(response.data.friends.map(friend => friend.id));
                    })
                    .catch(error => console.error('Error fetching friends:', error));
            }
        };

        fetchEventData();
    }, [id]);

 
    const sortedUsers = [...users].sort((a, b) => {
        const aIsFriend = friends.includes(a.id);
        const bIsFriend = friends.includes(b.id);
        return bIsFriend - aIsFriend;
    });

    const handleBackClick = () => {
        navigation.goBack();
    };

    if (!users.length) {
        return <ActivityIndicator size="large" color="#000" />;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackClick}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>{event?.name || 'Event'}</Text>
            </View>

            <Text style={styles.subtitle}>{`${users.length} users registered for this event.`}</Text>

            <FlatList
                data={sortedUsers}
                keyExtractor={(user) => user.id.toString()}
                renderItem={({ item: user }) => (
                    <View style={styles.userCard}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user.first_name[0]}</Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>
                                {`${user.first_name} ${user.last_name}`}
                                {friends.includes(user.id) && (
                                    <Ionicons name="ios-people" size={18} color="#ffa500" style={styles.friendIcon} />
                                )}
                            </Text>
                            <Text style={styles.userHandle}>@{user.handle}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        borderColor: '#ddd',
        borderWidth: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
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
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
    userHandle: {
        fontSize: 14,
        color: '#666',
    },
    friendIcon: {
        marginLeft: 5,
        color: '#ffa500', // Ámbar para destacar a los amigos
    },
});

