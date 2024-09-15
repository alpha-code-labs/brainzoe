import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import Home from './components/Home';
import Slider from './components/Slider';
import Login from './components/Login';
import Profile from './components/Profile';
import Userlogin from './components/Userlogin';
import Flipflop from './components/gamescreen/Flipflop';
import Gameplayflipflopscreen from './components/gameplayscreen/Gameplayflipflopscreen';
import Wordmatch from './components/gamescreen/Wordmatch';
import MathsGame from './components/gameplayscreen/gamplaymathscreen.js/MathGame';
import Puzzle from './components/gamescreen/Puzzle';
import Country from './components/gamescreen/Country';
import Computer from './components/countrybutton/Computer';
import Friend from './components/countrybutton/Friend';
import { store } from './redux/store';

const Stack = createStackNavigator();

function App() {
  const [initialRoute, setInitialRoute] = useState('Slider'); // Default route to 'Slider'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hide the splash screen after loading
    SplashScreen.hide();

    // Check if token is stored and set initial route
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token',); // Replace with your key for the token
        console.log("home", token);
        
        if (token) {
          setInitialRoute('Home'); // Redirect to Home if token exists
        } else {
          setInitialRoute('Slider'); // Redirect to Slider or login if no token
        }
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setLoading(false); // Stop loading once token is checked
      }
    };

    checkToken();
  }, []);

  if (loading) {
    // You can return a loading screen or null while token check is in progress
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute}>
          {/* Define your screens */}
          <Stack.Screen name="Slider" component={Slider} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Userlogin" component={Userlogin} />
          <Stack.Screen name="Flipflop" component={Flipflop} />
          <Stack.Screen name="Gameplayflipflopscreen" component={Gameplayflipflopscreen} />
          <Stack.Screen name="Wordmatch" component={Wordmatch} />
          <Stack.Screen name="Mathsplayscreen" component={MathsGame} />
          <Stack.Screen name="Puzzle" component={Puzzle} />
          <Stack.Screen name="Country" component={Country} />
          <Stack.Screen name="playwithcomputer" component={Computer} />
          <Stack.Screen name="playwithfriend" component={Friend} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
