import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import Home from './components/Home';
import Slider from './components/Slider';
import Phonenoscreen from './components/Phonenoscreen';
import SplashScreen from 'react-native-splash-screen';
import Flipflop from './components/gamescreen/Flipflop';
import Wordmatch from './components/gamescreen/Wordmatch';
import Maths from './components/gamescreen/Maths';
import Puzzle from './components/gamescreen/Puzzle';
import Country from './components/gamescreen/Country';
import Gameplayflipflopscreen from './components/gameplayscreen/Gameplayflipflopscreen';
import Computer from './components/countrybutton/Computer';
import Friend from './components/countrybutton/Friend';
import Math from './components/gameplayscreen/gamplaymathscreen.js/MathGame';
import MathsGame from './components/gameplayscreen/gamplaymathscreen.js/MathGame';
import { store } from './redux/store';
import { Provider } from 'react-redux';

const Stack = createStackNavigator();

function App() {
  useEffect(()=>{
    SplashScreen.hide();
  },[])

  return (
   
<Provider store={store}>
  
  
<NavigationContainer>
  <Stack.Navigator initialRouteName="Slider">
<Stack.Screen name="Slider" component={Slider}
  options={{ headerShown: false }}
/>
<Stack.Screen name="Home" component={Home}
 options={{ headerShown: false }}
/>
<Stack.Screen name="phonenoscreen" component={Phonenoscreen}
 options={{ headerShown: false }}
/>
<Stack.Screen name="Flipflop" component={Flipflop}/>
<Stack.Screen name="Gameplayflipflopscreen" component={Gameplayflipflopscreen}/>

<Stack.Screen name="Wordmatch" component={Wordmatch}/>


<Stack.Screen name="Maths" component={Maths}/>
<Stack.Screen name="Mathsplayscreen" component={MathsGame}/>


<Stack.Screen name="Puzzle" component={Puzzle}/>




<Stack.Screen name="Country" component={Country}/>
<Stack.Screen name="playwithcomputer" component={Computer}/>
<Stack.Screen name="playwithfriend" component={Friend}/>

  </Stack.Navigator>
</NavigationContainer>
 </Provider>
   
  )
}

export default App