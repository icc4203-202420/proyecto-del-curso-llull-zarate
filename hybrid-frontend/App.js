import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './app/Home';
import BeersList from './app/beers/BeersList';
import BeerDetails from './app/beers/BeerDetails';
import BeerShow from './app/beers/BeerShow'; // Asegúrate de que la ruta sea correcta

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BeersList" component={BeersList} />
        <Stack.Screen name="BeerDetails" component={BeerDetails} />
        <Stack.Screen name="BeerShow" component={BeerShow} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
