import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/Home';

import BeersList from './app/beers/BeersList';
import BeerDetailScreen from './app/beers/BeerDetailScreen';

import SignUp from './app/SignUp';
import Login from './app/Login';
import Logout from './app/Logout';
import Profile from './app/Profile';

import BarsList from './app/bars/BarsList';
import BarDetailScreen from './app/bars/BarDetailScreen';

import FriendIndex from './app/users/FriendIndex';
import FriendShow from './app/users/FriendShow';

import EventList from './app/events/EventList';
import EventIndex from './app/events/EventIndex';
import EventShow from './app/events/EventShow'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp">
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Logout" component={Logout} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BeersList" component={BeersList} />
        <Stack.Screen name="BeerDetailScreen" component={BeerDetailScreen} /> 
        <Stack.Screen name="BarsList" component={BarsList} />
        <Stack.Screen name="BarDetailScreen" component={BarDetailScreen} />
        <Stack.Screen name="FriendShow" component={FriendShow} />
        <Stack.Screen name="FriendIndex" component={FriendIndex} />
        <Stack.Screen name="EventList" component={EventList} />
        <Stack.Screen name="EventIndex" component={EventIndex} />
        <Stack.Screen name="EventShow" component={EventShow} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
