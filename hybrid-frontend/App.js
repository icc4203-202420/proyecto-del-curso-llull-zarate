import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/Home';
import BeersList from './app/beers/BeersList';
import BeerDetails from './app/beers/BeerDetails';
import BeerReview from './app/beers/BeerReview'; // Asegúrate de que la ruta sea correcta
import SignUp from './app/SignUp';
import Login from './app/Login';
import Logout from './app/Logout';
import Profile from './app/Profile';

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
        <Stack.Screen name="BeerDetails" component={BeerDetails} />
        <Stack.Screen name="BeerReview" component={BeerReview} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
