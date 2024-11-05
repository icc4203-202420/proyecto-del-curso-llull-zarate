import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TokenStorage from './app/TokenStorage'; 
import NotificationPusher from './app/NotificationPusher';


import Home from './app/Home';


import Login from './app/Login';
import SignUp from './app/SignUp';
import Logout from './app/Logout';
import Profile from './app/Profile';


import BeersList from './app/beers/BeersList';
import BeerDetailScreen from './app/beers/BeerDetailScreen';


import BarsList from './app/bars/BarsList';
import BarDetailScreen from './app/bars/BarDetailScreen';


import FriendIndex from './app/users/FriendIndex';
import FriendShow from './app/users/FriendShow';


import EventList from './app/events/EventList';
import EventIndex from './app/events/EventIndex';

import EventPicture from './app/events/EventPicture';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <NotificationPusher />
      <Stack.Navigator initialRouteName="TokenStorage">
        
      
        <Stack.Screen 
          name="TokenStorage" 
          component={TokenStorage} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="Profile" component={Profile} />      
        <Stack.Screen name="BeersList" component={BeersList} />
        <Stack.Screen name="BeerDetailScreen" component={BeerDetailScreen} options={{ title: 'Beer Details' }} />
        <Stack.Screen name="BarsList" component={BarsList} />
        <Stack.Screen name="BarDetailScreen" component={BarDetailScreen} options={{ title: 'Bar Details' }} />
        <Stack.Screen name="FriendIndex" component={FriendIndex} options={{ title: 'Friends' }} />
        <Stack.Screen name="FriendShow" component={FriendShow} options={{ title: 'Friend Details' }} />
        <Stack.Screen name="EventList" component={EventList} />
        <Stack.Screen name="EventIndex" component={EventIndex} options={{ title: 'Event Details' }} />
        <Stack.Screen name="EventPicture" component={EventPicture} options={{ title: 'Upload Photo' }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
